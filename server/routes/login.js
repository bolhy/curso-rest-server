const express = require('express')
const api = express.Router()
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

api.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contrasena incorrectos'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contrasena) incorrectos'
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: 60 * 60 });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token: token
        })
    })
})



module.exports = api;