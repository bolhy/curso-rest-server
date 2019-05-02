const express = require('express')
const api = express.Router()
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

api.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({
        email: body.email
    }, (err, usuarioDB) => {

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


        /* if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario o (contrasena) incorrectos'
            });
        } */

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {
            expiresIn: 60 * 60
        });

        return res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token
        })
    })
})

//Configuracion de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

api.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token).catch(error => {
        return res.status(403).json({
            ok: false,
            error
        })
    });

    Usuario.findOne({
        email: googleUser.email
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: 'Debe de usar su autenticacion normal'
                })
            } else {

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: 60 * 60
                });

                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            }
        } else {

            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioSave) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: 60 * 60
                });

                res.json({
                    ok: true,
                    usuario: usuarioSave,
                    token
                })

            })

        }

    })
})

module.exports = api;