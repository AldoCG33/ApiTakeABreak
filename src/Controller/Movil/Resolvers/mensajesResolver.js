const ChatbotMovil = require('../../../Data/model/ChatMovil');

const mensajesResolver = {
  Mutation: {
    guardarMensajesChat: async (_, { input }, ctx) => {
      try {
        // 1. Validación básica
        if (!input.mensaje || !Array.isArray(input.mensaje) || input.mensaje.length === 0) {
          throw new Error('Debe proporcionar al menos un mensaje');
        }

        // 2. Crear el documento para MongoDB
        const nuevoChat = {
          mensaje: input.mensaje.map(msg => ({
            rol: msg.rol,
            texto: msg.texto
          })),
          fecha: new Date().toISOString()
        };

        // 3. Guardar en la base de datos
        const chatGuardado = await ChatbotMovil.create(nuevoChat);
        
        if (!chatGuardado) {
          throw new Error('Error al guardar en la base de datos');
        }

        // 4. Retornar el resultado
        return {
          id: chatGuardado._id.toString(),
          mensaje: chatGuardado.mensaje,
          fecha: chatGuardado.fecha
        };

      } catch (error) {
        console.error("Error detallado al guardar chat:", error);
        throw new Error(`Error al guardar el chat: ${error.message}`);
      }
    }
  }
};

module.exports = mensajesResolver;
