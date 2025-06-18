const express = require('express');
const connectDB = require('./Data/Conexion/DB');
require('dotenv').config();
const Sync = require('./Data/sync');
const cors = require('cors');


const app = express();

// Conectar a la base de datos
connectDB();

// Middleware para parsear JSON, debe ir antes de las rutas
app.use(cors()); // 👈 Esta línea permite que tu frontend acceda al backend
app.use(express.json());

// Ejecutar sincronización
(async () => {
  await Sync();
})();

const authRoutes = require('./Routes/Web/authRoutes');
app.use('/api/web/auth', authRoutes);

const webRoutes = require('./Routes/Web'); // index.js
app.use('/api/web', webRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
