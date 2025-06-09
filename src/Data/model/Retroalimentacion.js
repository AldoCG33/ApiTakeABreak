const mongoose = require('mongoose');

const retroalimentacion = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios' },
  tipo: { 
    type: String, enum: ['recomendacion', 'chatbot', 'interfaz'] },
    texto: String,
    fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Retroalimentacion', retroalimentacion);
