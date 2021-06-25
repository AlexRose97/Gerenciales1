const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new Schema({
    username: { type: String, unique: true },
    nombre: { type: String },
    fotografia: { type: String },
    fecha_nac: { type: String },
    rol: [{
        ref: "Rol",
        type: Schema.Types.ObjectId
    }],
    telefono: { type: Number },
    correo: { type: String, unique: true },
    password: { type: String },
    carrito: [{
       cantidadT: {type: Number},
        total : {type: Number},
        productos: [
        {
                nombre: {type: String},
                cantidad: {type: Number},
                precio: {type: Number},
                categoria: {type: String},
                codigo :{type: String},
                descripcion: {type:String},
                imagen: {type: String}
        }
    ]
    }]
}, {
    timestamps: true,
    versionKey: false
});

// función para encriptar contraseña
usuarioSchema.statics.encriptarPass = async(password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

// función para comparar contraseñas
usuarioSchema.statics.compararPass = async(passRecibida, passActual) => {
    return await bcrypt.compare(passRecibida, passActual);
}

module.exports = model('Usuario', usuarioSchema);