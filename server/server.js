require('../config/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const api = require('./routes/index');
const path = require('path')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
    //web static
app.use(express.static(path.resolve(__dirname, `../public`)))

app.use('/api', api);

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log(`Corriendo mongodb`)
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
})