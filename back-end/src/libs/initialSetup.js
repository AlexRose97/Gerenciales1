const Rol = require('../models/Rol');
const Usuario = require('../models/Usuario');
const config = require("../Configs/claves");
const confInicial = {};

const bcrypt = require('bcryptjs');

confInicial.crearRoles = async() => {
    try {
        const contador = await Rol.estimatedDocumentCount();

        if (contador > 0) return;

        const roles = await Promise.all([
            new Rol({ nombre: "user" }).save(),
            new Rol({ nombre: "admin" }).save()
        ]);

        console.log(roles);
    } catch (error) {
        console.error(error);
    }
};

confInicial.crearAdmin = async() => {
    const usuario = await Usuario.findOne({ username: "admin" });
    const roleadmin = await Rol.find({ nombre: { $in: "admin" } });

    if (!usuario) {
        await Usuario.create({
            username: "admin",
            nombre: "Administrador",
            fotografia: config.foto,
            fecha_nac: "01/01/1980",
            rol: roleadmin.map((role) => role._id),
            telefono: 1234,
            correo: config.user,
            password: await bcrypt.hash("admin", 10)
        });
        console.log("admin creado");
    }
}

module.exports = confInicial;