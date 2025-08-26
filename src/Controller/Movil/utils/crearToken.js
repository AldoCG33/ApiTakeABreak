const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const crearToken = (usuarios, secreta, expiresIn) => {
    const { id, email, nombre, apellido } = usuarios;
    return jwt.sign(
        { id, email, nombre, apellido },
        secreta,
        { expiresIn }
    );
}

module.exports = crearToken;