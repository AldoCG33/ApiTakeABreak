const mongoose = require("mongoose");
const ChatbotMovil = require('../../../Data/model/ChatMovil');

const mensajesResolver = {
  Query: {
    obtenerChatPorUsuario: async (_, {}, ctx) => {
      if (!ctx.usuarios || !ctx.usuarios.id) {
        throw new Error('No autorizado');
      }

      return await ChatbotMovil
        .find({ usuarioId: ctx.usuarios.id })
        .sort({ fecha: -1 });
    }
  },

  Mutation: {
    guardarMensajesChat: async (_, { input, conversationId }, ctx) => {
      try {
        if (!ctx.usuarios || !ctx.usuarios.id) {
          throw new Error('No autorizado');
        }

        if (!input.mensaje || !Array.isArray(input.mensaje) || input.mensaje.length === 0) {
          throw new Error('Debe proporcionar al menos un mensaje');
        }

        const mensajesParaGuardar = input.mensaje.map(msg => ({
          rol: msg.rol,
          texto: msg.texto,
          emotion: msg.emotion || null,
          fecha: new Date()
        }));

        let conversacion;

        // 🚨 Validación correcta del ID
        const idEsValido = mongoose.Types.ObjectId.isValid(conversationId);

        if (conversationId && idEsValido) {
          conversacion = await ChatbotMovil.findByIdAndUpdate(
            conversationId,
            { $push: { mensaje: { $each: mensajesParaGuardar } } },
            { new: true }
          );
        }

        // 🟢 Si NO existe conversación → crear una nueva
        if (!conversacion) {
          conversacion = await ChatbotMovil.create({
            usuarioId: ctx.usuarios.id,
            mensaje: mensajesParaGuardar
          });
        }

        return conversacion;

      } catch (error) {
        console.error("Error al guardar chat:", error);
        throw new Error(`Error al guardar el chat: ${error.message}`);
      }
    }
  }
};

module.exports = mensajesResolver;
