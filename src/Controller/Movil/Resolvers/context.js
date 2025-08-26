const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '.env' });

const context = async ({ req }) => {
    // Obtener el token del header
    const authHeader = req.headers['authorization'] || '';
    
    // Verificar si el token existe 
    if (!authHeader.startsWith('Bearer ')) {
        return { usuarios: null };
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
        return { usuarios: null };
    }

    try {
        // Verificar y decodificar el token
        const usuarios = jwt.verify(token, process.env.SECRETA);
        return { usuarios };
    } catch (error) {
        console.log('Error de verificación del token:', error);
        return { usuarios: null };
    }
};

module.exports = context;