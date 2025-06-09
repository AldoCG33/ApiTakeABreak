const jwt = require('jsonwebtoken');
require('dotenv').config({path:'.env'});

const crearToken = (usuarios,secreta,expiresIn) => {

    const {id,email} = usuarios;
    return jwt.sign({id,email},secreta,{expiresIn});
}

module.exports = crearToken;