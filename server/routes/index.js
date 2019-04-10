const express = require('express')
const api = express.Router()
const login = require('./login');
const usuario = require('./usuario');

api.use(usuario)
api.use(login)

module.exports = api;