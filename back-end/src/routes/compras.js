const { Router } = require('express');
const router = Router();

const { crearCompra, getComprasUsuario, getCompras, editarCompra } = require('../controllers/compras.controller');
const { verificarToken, esAdmin } = require('../middlewares/autorizaciones');

// ruta: http://localhost:4000/api/compras
router.route('/')
    .post(crearCompra);

// ruta: http://localhost:4000/api/compras/id
router.route('/:id')
    .get(getComprasUsuario);

// ruta: http://localhost:4000/api/compras
router.route('/')
    .get(verificarToken, esAdmin, getCompras);

// ruta: http://localhost:4000/api/compras/codigo
router.route('/:codigo')
    .put(verificarToken, esAdmin, editarCompra);

module.exports = router;