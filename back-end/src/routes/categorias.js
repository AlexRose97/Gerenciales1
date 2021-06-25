const { Router } = require('express');
const router = Router();

const { getCategorias, crearCategoria } = require('../controllers/categorias.controller');
//const Categoria = require('../models/Categoria');

// ruta: http://localhost:4000/api/categorias
router.route('/')
    .get(getCategorias);

router.route('/')
    .post(crearCategoria);

module.exports = router;