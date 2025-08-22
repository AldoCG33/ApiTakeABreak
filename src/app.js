const express = require('express');
const http = require('http');           
const WebSocket = require('ws');        
require('dotenv').config();
const connectDB = require('./Data/Conexion/DB');
const Sync = require('./Data/sync');
const cors = require('cors');

const app = express();

//  Conectar a la base de datos
connectDB();

//  Middleware
app.use('/uploads', express.static('../public/AVATARES'))
app.use(cors());
app.use(express.json());

//  Sincronización inicial
(async () => {
  await Sync();
})();

//  Rutas
const authRoutes = require('./Routes/Web/authRoutes');
app.use('/api/web/', authRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

//  Crear servidor HTTP y WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

require('./Controller/Web/WebS')(wss);

//  Usar puerto 3001
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Servidor Express + WebSocket corriendo en puerto ${PORT}`);
});
