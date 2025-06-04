const mongoose = require('mongoose');


const Chat = new mongoose.Schema({
    chat_: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chat',
        required: true,
        trim: true,
    },
    contenido: {
      type: String,
      required: true,
      trim: true,
    },
  
  fechaDeEnvio: {
    type: Date,
    default: Date.now,
  },
  remitente:{
    type: String,
    required: true,
  }
},{autoCreate: true} );


const Chatmodel = mongoose.model('chat', Chat);

module.exports = Chatmodel;
