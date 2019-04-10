process.env.PORT = process.env.PORT || 3000;
const pass = 's42ehxFLdHa7oguK';
const cluster = 'mongodb+srv://terminator10:<password>@cluster0-wm3hp.mongodb.net/test';

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


/* Base de datos */
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI
}

process.env.URLDB = urlDB

/* VARIABLES DE AUTENTICACION */
process.env.CADUCIDAD = 60 * 60
process.env.SEED = process.env.SEED || 'este-es-el-secret'