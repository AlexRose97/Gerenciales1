const { Schema, model } = require('mongoose');

const rolSchema = new Schema({
    nombre: String
}, {
    versionKey: false
});

module.exports = model('Rol', rolSchema);