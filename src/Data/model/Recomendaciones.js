const mongoose = require('mongoose');

const Recomendaciones = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios'
    },
  emocion: String,
  recomendacion: [
    {
      tipo: { type: String },
      titulo: String,
      url: String,
      fuante: String
    }
  ],
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recomendacion', Recomendaciones);
