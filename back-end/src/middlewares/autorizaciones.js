const autorizacion = {};
const jwt = require('jsonwebtoken');
const config = require('../Configs/claves');
const Usuario = require('../models/Usuario');
const Rol = require('../models/Rol');

autorizacion.verificarToken = async(req, res, next) => {
    let token = req.headers["token-acceso"];
    if (!token) return res.status(403).json({ message: "Token no proporcionado" });

    try {
        const tokenDecodificado = await jwt.verify(token, config.secret);
        req.idUsuario = tokenDecodificado.id;
        const usuario = await Usuario.findById(req.idUsuario);
        if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

        next();
    } catch (error) {
        res.status(401).json({ message: "Sin autorización" });
    }
};

autorizacion.esAdmin = async(req, res, next) => {
    try {
        const usuario = await Usuario.findById(req.idUsuario);
        const arregloRoles = await Rol.find({ _id: { $in: usuario.rol } });

        for (let i = 0; i < arregloRoles.length; i++) {
            if (arregloRoles[i].nombre === "admin") {
                next();
                return;
            }
        }

        return res.status(403).json({ message: "Se requiere rol de Administrador" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
    }
};

module.exports = autorizacion;