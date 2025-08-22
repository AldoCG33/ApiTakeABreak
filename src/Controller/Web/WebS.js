const ChatWeb = require('../../Data/model/ChatWeb');
const Usuario = require('../../Data/model/Usuarios');

module.exports = (wss) => {
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
          recipientId,
          remitenteNombre: remitente?.nombre || 'Desconocido',
          text,
          timestamp: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString()
        };

        wss.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
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
};
