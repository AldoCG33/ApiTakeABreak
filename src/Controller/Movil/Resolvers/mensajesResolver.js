const Usuarios = require('../model/Usuarios')

const jwt = require('jsonwebtoken')
require('dotenv').config({path: '.env'})


const mensajesResolver= {

    Query:{
    mensaje: () => 'Hola desde Apollo Server 🤓'

    },
    Mutation:{
        
    }
}

module.exports = mensajesResolver




