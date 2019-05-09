const express = require('express')
const api = express.Router()
const login = require('./login');
const usuario = require('./usuario');
const categoria = require('./categoria')
const producto = require('./producto')

api.use(usuario)
api.use(login)
api.use(categoria)
api.use(producto)

module.exports = api;