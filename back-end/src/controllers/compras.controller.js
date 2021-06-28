const compraCtrl = {};
const Compra = require('../models/Compra');
const Usuario = require('../models/Usuario');
const dateTime = require('node-datetime');
const email = require('../Configs/nodemailer.config');

compraCtrl.crearCompra = async(req, res) => {
    try {
        const { username, metodoPago, direccion, horario, estado, productos, total } = req.body;

        //Verificar si existe usuario
        const usuario = await Usuario.findOne({ username });
        if (!usuario) return res.status(400).json({ message: "Usuario no existe" });

        let date = dateTime.create();
        let fecha = date.format('Y-m-d H:M:S');

        const nuevaCompra = new Compra({
            username: username,
            fecha: fecha,
            metodoPago: metodoPago,
            direccion: direccion,
            horario: horario,
            estado: estado,
            productos: productos,
            total: total
        });

        await nuevaCompra.save();
        res.status(200).json({ message: 'Compra creada exitosamente' })
    } catch (error) {
        console.log(error);
        return res.status(500).json(error)
    }
};

compraCtrl.getComprasUsuario = async(req, res) => {
    try {
        const usuarioId = await Usuario.findById({ _id: req.params.id });

        const compras = await Compra.find({ username: usuarioId.username });

        let listaCompras = [];
        compras.forEach((comp) => {
            const compraAux = {
                id: comp._id,
                fecha: comp.fecha,
                metodoPago: comp.metodoPago,
                direccion: comp.direccion,
                horario: comp.horario,
                estado: comp.estado,
                productos: comp.productos,
                total: comp.total
            }
            listaCompras.push(compraAux);
        })

        return res.status(200).json(listaCompras);
    } catch (error) {
        return res.status(400).json({ message: "Usuario no encontrado" });
    }
};

compraCtrl.getCompras = async(req, res) => {
    try {
        const compras = await Compra.find();
        let listaCompras = [];
        compras.forEach((comp) => {
            const compraAux = {
                id: comp._id,
                username: comp.username,
                fecha: comp.fecha,
                metodoPago: comp.metodoPago,
                direccion: comp.direccion,
                horario: comp.horario,
                estado: comp.estado,
                productos: comp.productos,
                total: comp.total
            }
            listaCompras.push(compraAux);
        })

        return res.status(200).json(listaCompras);
    } catch (error) {
        return res.status(400).json({ message: "Error en compras" });
    }
};

compraCtrl.editarCompra = async(req, res) => {
    try {
        const compraEdit = await Compra.findByIdAndUpdate(req.params.codigo, req.body);

        if (req.body.estado === 1) {

            const username = compraEdit.username;
            const usuario = await Usuario.findOne({ username });

            let date = dateTime.create();
            let fecha = date.format('Y-m-d H:M:S');

            let productos = `<table>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
            </tr>
            `;

            compraEdit.productos.forEach(prod => {
                productos += `<tr>
                <td>${prod.nombre}</td>
                <td>${prod.cantidad}</td>
                <td>Q.${prod.precio}</td>
                <td>Q.${prod.precio * prod.cantidad}</td>
            </tr>
            `;
            });

            productos += '</table>'

            const facturaHtml = `<head>
                <style>
                    table {
                    border: 1px solid #000;
                    border-spacing: 0;
                    }
                    th, td {
                    width: 25%;
                    text-align: center;
                    vertical-align: top;
                    border: 1px solid #000;
                    border-collapse: collapse;
                    padding: 0.3em;
                    }
                    th {
                    background: #eee;
                    }
                </style>
            </head>
            <h1>KAAN</h1>
            <h2>¡Hola ${username}!</h2>
            <p> Adjuntamos el detalle de tu compra <strong>${compraEdit._id}</strong> realizada el día ${compraEdit.fecha}</p>
            <p> Fecha de envío: ${fecha} </p>
            <br>
            ${productos}
            <br>
            <b> Total compra: Q.${compraEdit.total}</b>
            <p> ¡Gracias por confiar en "KAAN", el lugar perfecto para que realices todas tus compras! </p>
            </div>`;

            email.sendFactura(usuario.correo, facturaHtml);
        }

        res.status(200).json({ message: "Compra actualizada" });
    } catch (error) {
        return res.status(400).json({ message: "Compra no encontrada" });
    }
};

module.exports = compraCtrl;