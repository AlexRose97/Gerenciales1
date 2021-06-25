const categoriaCtrl = {};
const Categoria = require('../models/Categoria');

categoriaCtrl.getCategorias = async(req, res) => {
    const categorias = await Categoria.find();
    let lista_categorias = [];
    categorias.forEach((categ) => {
        const categoriatemp = {
            codigo: categ.codigo,
            nombre: categ.nombre,
            imagen: categ.imagen
        };
        lista_categorias.push(categoriatemp);
    });
    //console.log(lista_categorias);
    res.json(lista_categorias);
};

categoriaCtrl.crearCategoria = async(req, res) => {
    //console.log(req.body);
    const { codigo, nombre, imagen } = req.body;
    const nuevaCategoria = new Categoria({
        codigo: codigo,
        nombre: nombre,
        imagen: imagen
    });
    await nuevaCategoria.save();
    res.json({ message: 'Categoria saved' })
};

module.exports = categoriaCtrl;