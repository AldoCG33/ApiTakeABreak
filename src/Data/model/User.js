// user.js
const mongoose = require('mongoose');

const User = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  apellido: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  edad: {
    type: Number,
    min: 0,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  contraseña:{
    type: String,
    required: true,
  },
  sexo: {
    type: String,
    enum: ['masculino', 'femenino', 'otro'],
    required: true,
  },
},{autoCreate: true} );


const Usermodel = mongoose.model('Usuarios', User);

module.exports = Usermodel;
