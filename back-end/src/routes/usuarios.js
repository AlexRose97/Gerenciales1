const { Router } = require('express');
const router = Router();

const { crearUsuario, getUsuarios, getUsuarioId, editarUsuario, eliminarUsuario } = require('../controllers/usuarios.controller');
const verificarUsuarioRepetido = require('../middlewares/verificaciones');
const { verificarToken } = require('../middlewares/autorizaciones');

// ruta: http://localhost:4000/api/usuarios
router.route('/')
    .get(getUsuarios);

// ruta: http://localhost:4000/api/usuarios/id
router.route('/:id')
    .get(getUsuarioId);

// ruta: http://localhost:4000/api/usuarios
router.route('/')
    .post(verificarUsuarioRepetido, crearUsuario);

// ruta: http://localhost:4000/api/usuarios/id
router.route('/:id')
    .put(verificarToken, editarUsuario);

// ruta: http://localhost:4000/api/usuarios/id
router.route('/:id')
    .delete(verificarToken, eliminarUsuario);

module.exports = router;