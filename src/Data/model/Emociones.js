const mongoose = require('mongoose');

const Emociones = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuarios'
},
  origen: {
    type: String,
    enum: ['chatbot', 'chat_web'] },
  emocion: String,
  confianza: Number,
  texto: String,
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Emociones', Emociones);
