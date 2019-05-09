const express = require('express')
const api = express.Router()
let {
    verificarToken
} = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria')
const _ = require('underscore');

/* Mostrar todas las categorias */
api.get('/categoria', (req, res) => {

        Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email')
            .exec()
            .then(resp => {
                console.log(resp);
                return res.json({
                    ok: true,
                    categoria: resp
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
    /* Mostrar categoria por id */
api.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id).then(categoria => {
        console.log(categoria);
        return res.json({
            ok: true,
            categoria
        })
    }).catch(error => {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error
        })
    })
})

/* Crear categoria --- req.usuario._id */
api.post('/categoria', verificarToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save()
        .then(categoria => {
            console.log(categoria);
            return res.json({
                ok: true,
                categoria
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

/* Actualizar categoria */
api.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, [
        'descripcion'
    ]);

    Categoria.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }).then(categoria => {
        console.log(categoria);
        return res.json({
            ok: true,
            categoria
        })
    }).catch(error => {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error
        })
    })

})

/* Eliminar categoria
   Solo un administrador puede borrar categorias
*/
api.delete('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id).then(categoria => {
        console.log(categoria);
        return res.json({
            ok: true,
            categoria
        })
    }).catch(error => {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error
        })
    })

})

module.exports = api;