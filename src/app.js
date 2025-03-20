const express = require('express');
const connectDB = require('./Data/Conexion/DB'); // Importar la conexión a MongoDB
require('dotenv').config(); // Cargar variables de entorno

const app = express();

// Conectar a la base de datos
connectDB();

app.use(express.json()); // Middleware para parsear JSON

app.get('/', (req, res) => {
    res.send('API funcionando');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
