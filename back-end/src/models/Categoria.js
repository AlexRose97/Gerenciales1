const { Schema, model } = require('mongoose');

const categoriaSchena = new Schema({
    codigo: { type: String, required: true },
    nombre: { type: String, required: true },
    imagen: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = model('Categoria', categoriaSchena);