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
    guardarMensajesChat: async (_, { input }, ctx) => {
      try {
        // Verificar autenticación
        if (!ctx.usuarios || !ctx.usuarios.id) {
          throw new Error('No autorizado');
        }

        // Buscar si ya existe un chat para este usuario
        let chatExistente = await ChatbotMovil.findOne({ 
          usuarioId: ctx.usuarios.id 
        });

        if (chatExistente) {
          // Si existe, agregar los nuevos mensajes al array existente
          chatExistente.mensaje.push(...input.mensaje);
          const resultado = await chatExistente.save();
          return resultado;
        } else {
          // Si no existe, crear un nuevo documento
          const nuevoHistorial = new ChatbotMovil({
            usuarioId: ctx.usuarios.id,
            mensaje: input.mensaje
          });

          const resultado = await nuevoHistorial.save();
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