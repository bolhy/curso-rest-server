const jwt = require('jsonwebtoken');

let verificarToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();
    })
}

let verificarAdmin = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role == 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: 'No tiene permiso para crear usuarios'
        })
    }
}

module.exports = {
    verificarToken,
    verificarAdmin
}