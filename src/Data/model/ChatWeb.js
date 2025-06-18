const mongoose = require('mongoose');

const ChatWeb = new mongoose.Schema({
  participantes: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios' }],
  mensajes: [
    {
      remitenteId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios' },
      texto: String,
      fecha: { type: Date, default: Date.now }
    }
  ],
  emocionesDetectadas: [
    {
      usuarioId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios' },
      emocion: String,
      confianza: Number
    }
  ],
  creado_en: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatWeb', ChatWeb);
