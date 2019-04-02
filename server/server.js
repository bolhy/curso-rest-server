require('../config/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {
    res.send('get usuario')
})

app.post('/usuario', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: `Error el nombre es necesario`
        })
    }

    res.json({
        body
    })
})

app.put('/update/:id', function(req, res) {

    let id = req.params.id;

    res.json({
        id
    })
})

app.delete('/usuario', function(req, res) {
    res.send('delete usuario')
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto`);
})