const { Router } = require('express');
const router = Router();

const { recuperarPassword } = require('../controllers/usuarios.controller')

// ruta: http://localhost:4000/api/password
router.route('/')
    .post(recuperarPassword);

module.exports = router;