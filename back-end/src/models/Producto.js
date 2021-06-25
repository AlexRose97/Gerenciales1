const { Schema, model } = require('mongoose');

const productoSchena = new Schema({
    producto: {
        codigo: String,
        nombre: String,
        precio: Number,
        categoria: String,
        descripcion: String,
        imagen: String
    }
}, {
    timestamps: true
})

module.exports = model('Producto', productoSchena);