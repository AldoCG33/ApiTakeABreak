const mongoose = require('mongoose');


const Chat = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  usuario_: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuarios',
    required: true,
    trim: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
 
  plataforma: {
    type: String,
    enum: ['web','movil'],
    required: true,
  },
},{autoCreate: true} );


const Chatmodel = mongoose.model('Chat', Chat);

module.exports = Chatmodel;
