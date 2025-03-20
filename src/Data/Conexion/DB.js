const mongoose = require('mongoose');
require('dotenv').config(); // Cargar variables de entorno

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Atlas conectado');
    } catch (error) {
        console.error('❌ Error al conectar MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
