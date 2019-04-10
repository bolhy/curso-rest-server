const express = require('express')
const api = express.Router()

const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');
const _ = require('underscore');

const { verificarToken, verificarAdmin } = require('../middlewares/autenticacion');

api.get('/usuario', verificarToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({})
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: false }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })
            })

        })

})

api.post('/usuario', [verificarToken, verificarAdmin], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

})

api.put('/usuario/:id', verificarToken, function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, [
        'nombre',
        'email',
        'img',
        'role',
        'estado'
    ]);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuarioNew: usuarioDB
        })

    });
})

api.delete('/usuario/:id', verificarToken, function(req, res) {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, {
        new: true
    }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuarioNew: usuarioDB
        })

    });

    /*  Usuario.findByIdAndRemove(id, (err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario
        })

    })
 */
})

module.exports = api;