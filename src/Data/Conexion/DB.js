const mongoose = require('mongoose');
require('dotenv').config(); // Cargar variables de entorno

const ConexionDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' MongoDB Atlas conectado', mongoose.connection.name);
    } catch (error) {
        console.error('Error al conectar MongoDB:', error);
        //process.exit(1);
    }
};

module.exports = ConexionDB;
