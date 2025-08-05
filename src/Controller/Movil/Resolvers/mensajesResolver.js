const ChatbotMovil = require('../../../Data/model/ChatMovil');

const mensajesResolver = {
  Query: {
    obtenerChatPorUsuario: async (_, {}, ctx) => {
      // Verificar autenticación
      if (!ctx.usuarios || !ctx.usuarios.id) {
        throw new Error('No autorizado');
      }
      
      // Obtener historial del usuario autenticado
      const historial = await ChatbotMovil.find({ usuarioId: ctx.usuarios.id })
        .sort({ fecha: -1 });
      return historial;
    }
  },

  Mutation: {
   guardarMensajesChat: async (_, { input, conversationId }, ctx) => {
      try {
        if (!ctx.usuarios || !ctx.usuarios.id) {
          throw new Error('No autorizado');
        }

        if (conversationId) {
          // Actualizar conversación existente
          const chatActualizado = await ChatbotMovil.findByIdAndUpdate(
            conversationId,
            { $push: { mensaje: { $each: input.mensaje } } },
            { new: true }
          );
          return chatActualizado;
        } else {
          // Crear nueva conversación
          const nuevoChat = new ChatbotMovil({
            usuarioId: ctx.usuarios.id,
            mensaje: input.mensaje
          });
          const resultado = await nuevoChat.save();
          return resultado;
        }
      } catch (error) {
        console.error("Error al guardar chat:", error);
        throw new Error("No se pudo guardar el chat");
      }
    }
  }
};

module.exports = mensajesResolver;