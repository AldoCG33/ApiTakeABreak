const express = require('express');
const http = require('http');           // Para crear servidor HTTP
const WebSocket = require('ws');        // WebSocket
const connectDB = require('./Data/Conexion/DB');
require('dotenv').config();
const Sync = require('./Data/sync');
const cors = require('cors');

const ChatWeb = require('./Data/model/ChatWeb'); // Ajusta ruta si es necesario
const Usuario = require('./Data/model/Usuarios'); // Ajusta ruta si es necesario

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Sincronización
(async () => {
  await Sync();
})();

// Rutas
const authRoutes = require('./Routes/Web/authRoutes');
app.use('/api/web/auth', authRoutes);

const webRoutes = require('./Routes/Web'); // index.js
app.use('/api/web', webRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

// Crear servidor HTTP para Express
const server = http.createServer(app);

// Crear servidor WebSocket sobre el mismo HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      const { userId, recipientId, text } = data;

      let chat = await ChatWeb.findOne({
        participantes: { $all: [userId, recipientId] }
      });

      if (!chat) {
        chat = new ChatWeb({
          participantes: [userId, recipientId],
          mensajes: []
        });
      }

      const nuevoMensaje = {
        remitenteId: userId,
        texto: text,
        fecha: new Date()
      };

      chat.mensajes.push(nuevoMensaje);
      await chat.save();

      const remitente = await Usuario.findById(userId).select('nombre');

      const response = {
        remitenteId: userId,
        remitenteNombre: remitente?.nombre || 'Desconocido',
        text: text,
        timestamp: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
      };

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(response));
        }
      });

    } catch (err) {
      console.error('Error al procesar el mensaje:', err);
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Usar el puerto asignado por Render
const PORT = process.env.PORT || 3001;

// Levantar el servidor HTTP (Express + WS)
server.listen(PORT, () => {
  console.log(`🚀 Servidor Express y WebSocket corriendo en puerto ${PORT}`);
});
