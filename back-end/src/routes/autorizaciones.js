const { Router } = require('express');
const router = Router();

const { login } = require('../controllers/usuarios.controller')

// ruta: http://localhost:4000/api/login
router.route('/')
    .post(login);

module.exports = router;