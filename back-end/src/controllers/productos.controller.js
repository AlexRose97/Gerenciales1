const productoCtrl = {};
const Producto = require('../models/Producto');

productoCtrl.getProductos = async(req, res) => {
    const productos = await Producto.find();
    let lista_productos = [];
    productos.forEach((prod) => {
        lista_productos.push(prod.producto);
    });

    res.json(lista_productos);
};

productoCtrl.getProductoId = async(req, res) => {
    const { id } = req.params;
    const productoId = await Producto.find({ "producto.codigo": id });

    if (productoId.length === 0) return res.status(400).json({ message: "Producto no encontrado" });

    let producto;
    productoId.map((prod) => {
        producto = prod.producto;
    });

    res.status(200).json({
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio: producto.precio,
        categoria: producto.categoria,
        descripcion: producto.descripcion,
        imagen: producto.imagen
    });
}

productoCtrl.getProductosCategoria = async(req, res) => {
    const { codigo } = req.params;
    const prodcateg = await Producto.find({ "producto.categoria": codigo });
    let lista_productos = [];
    prodcateg.forEach((prod) => {
        lista_productos.push(prod.producto);
    });

    res.json(lista_productos);
};

productoCtrl.crearProductos = async(req, res) => {
    const producto = req.body;

    const newProducto = new Producto({
        producto: {
            codigo: producto.codigo,
            nombre: producto.nombre,
            precio: producto.precio,
            categoria: producto.categoria,
            descripcion: producto.descripcion,
            imagen: producto.imagen
        }
    });
    await newProducto.save();
    res.json({ message: 'Producto guardado' });
};

productoCtrl.editarProducto = async(req, res) => {
    const { codigo } = req.params;

    const productoEdit = await Producto.findOneAndUpdate({ "producto.codigo": codigo }, req.body);

    if (!productoEdit) return res.status(400).json({ message: "Producto no encontrado" });
    console.log(productoEdit);

    res.status(200).json({ message: "Producto modificado" });
};

productoCtrl.eliminarProducto = async(req, res) => {
    const { codigo } = req.params;

    const productoEdit = await Producto.findOneAndDelete({ "producto.codigo": codigo }, req.body);

    if (!productoEdit) return res.status(400).json({ message: "Producto no encontrado" });
    console.log(productoEdit);

    res.status(200).json({ message: "Producto eliminado" });
}

module.exports = productoCtrl;