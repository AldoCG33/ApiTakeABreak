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
    // 1. Verificar autenticación
    if (!ctx.usuarios || !ctx.usuarios.id) {
      throw new Error('No autorizado');
    }

    // 2. Validar input
    if (!input.mensaje || !Array.isArray(input.mensaje) || input.mensaje.length === 0) {
      throw new Error('Debe proporcionar al menos un mensaje');
    }

    // 3. Preparar mensajes con campos requeridos
    const mensajesParaGuardar = input.mensaje.map(msg => ({
      rol: msg.rol,
      texto: msg.texto,
      emotion: msg.emotion || null,
      fecha: new Date() // Fecha automática
    }));

    // 4. Manejar conversación existente o nueva
    if (conversationId) {
      // Actualizar conversación existente
      const chatActualizado = await ChatbotMovil.findByIdAndUpdate(
        conversationId,
        { $push: { mensaje: { $each: mensajesParaGuardar } } },
        { new: true }
      );
      
      if (!chatActualizado) {
        throw new Error('Conversación no encontrada');
      }
      
      return chatActualizado;
    } else {
      // Crear nueva conversación
      const nuevoChat = new ChatbotMovil({
        usuarioId: ctx.usuarios.id,
        mensaje: mensajesParaGuardar
      });
      
      const resultado = await nuevoChat.save();
      return resultado;
    }
  } catch (error) {
    console.error("Error al guardar chat:", error);
    throw new Error(`Error al guardar el chat: ${error.message}`);
  }
}
  }
};

module.exports = mensajesResolver;