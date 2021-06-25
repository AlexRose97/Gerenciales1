const { Schema, model } = require('mongoose');

const compraSchema = new Schema({
    username: { type: String },
    fecha: { type: String },
    metodoPago: { type: String },
    direccion: { type: String },
    horario: { type: String },
    estado: { type: Number },
    productos: [{
        nombre: { type: String },
        cantidad: { type: Number },
        precio: { type: Number },
        categoria: { type: String },
        codigo: { type: String },
        descripcion: { type: String },
        imagen: { type: String }
    }],
    total: { type: Number }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('Compra', compraSchema);