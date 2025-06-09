const mongoose = require('mongoose');

const chatbotmovil = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios'
},
  mensaje: [
    {
      rol: { type: String,
         enum: ['user', 'bot'] 
        },
      texto: String
    }
  ],
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatbotMovil', chatbotmovil);
