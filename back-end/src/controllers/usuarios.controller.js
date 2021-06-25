const usuarioCtrl = {};
const Usuario = require('../models/Usuario');
const email = require('../Configs/nodemailer.config');
const config = require('../Configs/claves');
const jwt = require('jsonwebtoken');
const Rol = require('../models/Rol');

usuarioCtrl.getUsuarios = async(req, res) => {
    const usuarios = await Usuario.find();
    let lista_usuarios = [];
    usuarios.forEach((item) => {
        const usuarioAux = {
            id: item._id,
            username: item.username,
            nombre: item.nombre,
            fotografia: item.fotografia,
            fecha_nac: item.fecha_nac,
            rol: item.rol,
            telefono: item.telefono,
            correo: item.correo,
            password: item.password
        };
        lista_usuarios.push(usuarioAux);
    });

    res.json(lista_usuarios);
};

usuarioCtrl.getUsuarioId = async(req, res) => {
    const usuarioId = await Usuario.findById(req.params.id);

    if (!usuarioId) return res.status(400).json({ message: "Usuario no encontrado" });

    const roles = await Rol.find({ _id: { $in: usuarioId.rol } });
    // se asigna el nombre del rol
    const rolesUsuario = roles.map(role => role.nombre);

    let lista_carrito = [];
    if (usuarioId.carrito[0] == null) {
        console.log("carro vacio")
    } else {
        let lista_productoC = [];
        usuarioId.carrito[0].productos.forEach((item) => {
            const temp = {
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: item.precio,
                categoria: item.categoria,
                codigo: item.codigo,
                descripcion: item.descripcion,
                imagen: item.imagen
            }
            lista_productoC.push(temp)
        })

        usuarioId.carrito.forEach((item) => {
            const aux = {
                total: item.total,
                cantidadT: item.cantidadT,
                productos: lista_productoC

            }
            lista_carrito.push(aux);
        })
    }

    res.status(200).json({
        username: usuarioId.username,
        nombre: usuarioId.nombre,
        fotografia: usuarioId.fotografia,
        fecha_nac: usuarioId.fecha_nac,
        telefono: usuarioId.telefono,
        correo: usuarioId.correo,
        rol: rolesUsuario,
        carrito: lista_carrito
    });
}

usuarioCtrl.crearUsuario = async(req, res) => {
    try {
        const { username, nombre, fotografia, fecha_nac, rol, telefono, correo, password } = req.body;
        const nuevo = new Usuario({
            username: username,
            nombre: nombre,
            fotografia: fotografia,
            fecha_nac: fecha_nac,
            telefono: telefono,
            correo: correo,
            password: await Usuario.encriptarPass(password)
        });

        // verifica el rol indicado o bien asigna el rol por defecto si no se envía en la solicitud
        if (rol) {
            // se busca el rol en la bd
            const rolEncontrado = await Rol.find({ nombre: { $in: rol } });
            // se asigna el id del rol
            nuevo.rol = rolEncontrado.map(role => role._id);
        } else {
            // buscar el rol a asignar
            const rolAsignar = await Rol.findOne({ nombre: "user" });
            // le asigna el rol por defecto al nuevo usuario
            nuevo.rol = [rolAsignar._id];
        }

        await nuevo.save();

        res.status(200).json({ message: 'Usuario agregado exitosamente' })

        email.sendConfirmationEmail(
            nuevo.username,
            nuevo.correo
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }

};

usuarioCtrl.editarUsuario = async(req, res) => {
    if (req.body.password) {
        req.body.password = await Usuario.encriptarPass(req.body.password);
    }

    await Usuario.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });

    res.status(200).json({ message: "Usuario modificado" });
};

usuarioCtrl.eliminarUsuario = async(req, res) => {
    await Usuario.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Usuario eliminado" });
}

usuarioCtrl.login = async(req, res) => {
    const { correo, password } = req.body;
    // populate => se encarga de buscar el id del rol en el documento Rol y obtener su id(s) y nombre del rol(es)
    const usuario = await Usuario.findOne({ correo }).populate("rol");

    if (!usuario) return res.status(400).json({ message: "Usuario no existe" });

    // se envía a comparar (pass enviada en la solicutud, pass del usuario encontrado)
    const esPassword = await Usuario.compararPass(password, usuario.password);

    if (!esPassword) return res.status(401).json({ message: "Contraseña incorrecta" });

    // se genera un token al iniciar sesión
    const token = jwt.sign({ id: usuario._id }, config.secret, {
        expiresIn: 3600
    });

    // devuelve 1 si el usuario que está iniciando sesión es administrador
    const arregloRoles = await Rol.find({ _id: { $in: usuario.rol } });
    let tipo = 0;
    for (let i = 0; i < arregloRoles.length; i++) {
        if (arregloRoles[i].nombre === "admin") {
            tipo = 1;
        }
    }

    let lista_carrito = [];
    if (usuario.carrito[0] == null) {
        console.log("vacio");
    } else {
        let lista_productoC = [];
        usuario.carrito[0].productos.forEach((item) => {
            const temp = {
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: item.precio,
                categoria: item.categoria,
                codigo: item.codigo,
                descripcion: item.descripcion,
                imagen: item.imagen
            }
            lista_productoC.push(temp)
        })

        usuario.carrito.forEach((item) => {
            const aux = {
                total: item.total,
                cantidadT: item.cantidadT,
                productos: lista_productoC

            }
            lista_carrito.push(aux);
        })
    }
    res.status(200).json({ id: usuario._id, token, username: usuario.username, password, tipo, nombre: usuario.nombre, foto: usuario.fotografia, telefono: usuario.telefono, carrito: lista_carrito });
};

usuarioCtrl.recuperarPassword = async(req, res) => {
    try {
        const { correo } = req.body;
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) return res.status(400).json({ message: "Usuario no existe" });
        var codigo = generateRandomString(15)

        const usuarioNuevo = new Usuario({
            username: usuario.username,
            nombre: usuario.nombre,
            fotografia: usuario.fotografia,
            fecha_nac: usuario.fecha_nac,
            telefono: usuario.telefono,
            correo: usuario.correo,
            password: await Usuario.encriptarPass(codigo)
        });

        await Usuario.findByIdAndUpdate(usuario.id, { password: usuarioNuevo.password }, {
            new: false,
            useFindAndModify: false
        });

        //Enviar correo
        email.sendRecoverPasswordEmail(
            usuario.username,
            usuario.correo,
            codigo
        );

        res.status(200).json({ message: "Contraseña temporal enviada al correo" });
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
};

const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = Math.random().toString(36).substring(2, num);
    return result1;
}


module.exports = usuarioCtrl;