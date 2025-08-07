const mongoose = require('mongoose');

const chatbotmovil = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: true
  },
  mensaje: [
    {
      rol: { 
        type: String,
        enum: ['user', 'bot'],
        required: true
      },
      texto: {
        type: String,
        required: true
      },
      emotion:{
        type:String
      },
      fecha: {
        type: Date,
        default: Date.now
      }
    }
  ],
  fecha: { 
    type: Date, 
    default: Date.now,
    index: true 
  }
});

// Agregar índices para mejor performance
chatbotmovil.index({ usuarioId: 1, fecha: -1 });

module.exports = mongoose.model('ChatbotMovil', chatbotmovil);