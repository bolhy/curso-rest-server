const express = require('express')
const api = express.Router();
let Producto = require('../models/producto')
let {
    verificarToken
} = require('../middlewares/autenticacion');

/* Obtener todos los productos
    Populate: usuario y categoria
    paginado
 */
api.get('/productos', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({})
        .sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec()
        .then(productos => {
            console.log(productos);
            return res.json({
                ok: true,
                productos
            })
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({
                ok: false,
                error
            })
        })
})

/* Obtener un producto por su id  */
api.get('/productos/:id', (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec()
        .then(producto => {
            console.log(producto);
            return res.json({
                ok: true,
                producto
            })
        }).catch(error => {
            console.log(error);
            return res.status(500).json({
                ok: false,
                error
            })
        })
})

api.get('/productos/buscar/:termino', (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })
})

/* Crear productos */
api.post('/productos', verificarToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save()
        .then(producto => {
            console.log(producto);
            return res.json({
                ok: true,
                producto
            })
        }).catch(error => {
            console.log(error);
            return res.status(500).json({
                ok: false,
                error
            })
        })

})

/* Actualizar el producto */
api.put('/productos/:id', async(req, res) => {

    let id = req.params.id;
    let body = req.body;
    try {
        let producto = await Producto.findById(id).exec();
        producto.nombre = body.nombre;
        producto.descripcion = body.descripcion;
        producto.precioUni = body.precioUni;
        producto.disponible = body.disponible;
        producto.categoria = body.categoria;

        try {
            let saveProducto = await producto.save();
            return res.json({
                ok: true,
                producto: saveProducto
            })
        } catch (error) {
            return res.status(500).json({
                ok: false,
                error: error.message
            })
        }
    } catch (error) {
        console.log('Error: ' + error);

        if (error.name == 'CastError') {
            console.log('No existe el ID');
            return res.status(400).json({
                ok: false,
                message: 'No existe el ID definido'
            })
        }

        return res.status(500).json({
            ok: false,
            error: error.message
        })
    }
})

/* Borrar producto cambiar el estado a false */
api.delete('/productos/:id', async(req, res) => {

    let id = req.params.id;

    try {
        let borrarProducto = await Producto.findByIdAndUpdate(id, { disponible: false }).exec();
        return res.status(200).json({
            ok: true,
            producto: borrarProducto
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: error.message
        })
    }

})


module.exports = api;