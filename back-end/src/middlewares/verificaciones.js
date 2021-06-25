const Usuario = require('../models/Usuario');

const verificarUsuarioRepetido = async(req, res, next) => {
    const usuario = await Usuario.findOne({ username: req.body.username });

    if (usuario) return res.status(400).json({ message: "Usuario ya existe" });

    const email = await Usuario.findOne({ correo: req.body.correo });

    if (email) return res.status(400).json({ message: "Ya existe un usuario con el correo" });

    next();
};

module.exports = verificarUsuarioRepetido;