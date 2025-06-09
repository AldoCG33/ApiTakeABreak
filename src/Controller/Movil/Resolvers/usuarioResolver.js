const Usuarios = require('../../../Data/model/Usuarios');
const bcryptjs = require('bcryptjs');


const crearToken = require('../utils/crearToken');

const usuarioResolver= {

    Query:{
     obtenerUsuarios:async (_,{},ctx) => {
        const usuarios = await Usuarios.find();
        return usuarios
     }

    },

    Mutation:{

        crearUsuarios: async (_,{input}) => {
            const {email,password} = input;

            const existeUsuarios = await Usuarios.findOne({ email });
            // console.log(existeUsuario)
            //si el usuario existe
            if(existeUsuarios){
                throw new Error('El usuario ya esta registrado');
            }

            try{
                // Hasheear password
                const salt= await bcryptjs.genSalt(10)
                input.password = await bcryptjs.hash(password, salt)
        
                // Registrar nuevo usuario
                const nuevoUsuarios = new Usuarios(input);
                // console.log(nuevoUsuario)

                // guardar el usuario y mandar mensaje de confirmacion
                await nuevoUsuarios.save();
                return "Usuario Creado Correctamente";
            } catch(error){
                // console.log(error);
                throw new Error('Error al crear el usuario')
            }
        },


        autenticarUsuarios: async (_,{input}) =>{

            const{email,password} = input;

            //Si el usuario existe
            const existeUsuarios = await Usuarios.findOne({email});
            //si el usuario existee
            if(!existeUsuarios){
                throw new Error('El usuario no existe');
            }

            //Si el password es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuarios.password);
            
            if(!passwordCorrecto){
                throw new Error('Contraseña incorrecta');
            }

            //Dar acceso ala app
            return {
                token: crearToken(existeUsuarios, process.env.SECRETA,'1000h')
            }

        },

    }
}

module.exports = usuarioResolver




