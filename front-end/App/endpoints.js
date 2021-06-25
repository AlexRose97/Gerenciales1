//--recuerda no subir credenciales de aws, agregarlo en el gitignore
const ip = "http://IP.../api"
module.exports = {

  // API POST REGISTRO DE NUEVO USUARIO
urlLogin: ip + "/login",

// API POST CAMBIO DE CONTRASEÑA
contrasenia: ip + "/password",

// API POST REGISTRO DE NUEVO USUARIO
usuario: ip + "/usuarios",

categoriass: ip + "/categorias",

// API GET PRODUCTOS
productos: ip + "/productos",

// PUT CARRITO
carrito: ip + "/usuarios/",

// POST COMPRA
compras: ip + "/compras/"

};