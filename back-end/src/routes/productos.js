const { Router } = require('express');
const router = Router();

const { getProductos, getProductosCategoria, crearProductos, getProductoId, editarProducto, eliminarProducto } = require('../controllers/productos.controller');
const Producto = require('../models/Producto');
const { verificarToken, esAdmin } = require('../middlewares/autorizaciones');

// ruta: http://localhost:4000/api/productos
router.route('/')
    .get(getProductos);
// ruta: http://localhost:4000/api/productos/codigo
router.route('/:codigo')
    .get(getProductosCategoria);

// ruta: http://localhost:4000/api/productos/codigo/id
router.route('/codigo/:id')
    .get(getProductoId);

router.route('/')
    .post(verificarToken, esAdmin, crearProductos);

// ruta: http://localhost:4000/api/productos/codigo
router.route('/:codigo')
    .put(verificarToken, esAdmin, editarProducto);

// ruta: http://localhost:4000/api/productos/codigo
router.route('/:codigo')
    .delete(verificarToken, esAdmin, eliminarProducto);

module.exports = router;