const Usuario = require('../models/Usuario')
const Pelicula = require('../models/Pelicula')
const Serie = require('../models/Serie')
const Hacer = require('../models/Hacer')
const Bebida = require('../models/Bebida')
const Restaurante = require('../models/Restaurante')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Inbox = require('../models/Inbox')
require('dotenv').config({path: 'variables.env'})

//Crea y firma un jwt 
// const crearToken = (usuario,secreta,expiresIn) =>{
    const crearToken = (usuario,secreta) =>{
    const{id,email} = usuario;
     return jwt.sign({id,email}, secreta);
    // return jwt.sign({id,email}, secreta,{expiresIn});


}

const resolvers= {


    Query:{
     obtenerPelicula:async (_,{},ctx) =>{
        // const pelicula = await Pelicula.find({creador: ctx.usuario.id})
        const pelicula = await Pelicula.find()
        return pelicula
     },
     obtenerSerie:async (_,{},ctx) => {
        const serie = await Serie.find()
        return serie
     },
     obtenerRestaurante:async (_,{},ctx) =>{
     const restaurante = await Restaurante.find();
     return restaurante
    },
    obtenerBebida:async (_,{},ctx) => {
        const bebida = await Bebida.find();
        return bebida
    },
    obtenerHacer:async (_,{},ctx) => {
        const hacer = await Hacer.find();
        return hacer
    },
    obtenerInbox:async (_,{},ctx) =>{
        const inbox = await Inbox.find();
        return inbox
    }
     

    },
    Mutation:{
        crearUsuario: async (_,{input}) => {
            const {email,password} = input;
            const existeUsuario = await Usuario.findOne({email});
            console.log(existeUsuario)
            //si ele usuario existee
            if(existeUsuario){
                throw new Error('El usuario ya esta registrado');
            }

            try{
                // Hasheear password
                const salt= await bcryptjs.genSalt(10)
                input.password = await bcryptjs.hash(password, salt)
        

                // Registrar nuevo usuario
                const nuevoUsuario = new Usuario(input);
                // console.log(nuevoUsuario)

                await nuevoUsuario.save();
                return "Usuario Creado Correctamente";
            } catch(error){
                console.log(error);
            }
        },
        autenticarUsuario: async (_,{input}) =>{
            const{email,password} = input

            //Si el usuario existe
            const existeUsuario = await Usuario.findOne({email});
            //si el usuario existee
            if(!existeUsuario){
                throw new Error('El usuario no existe');
            }

            //Si el password es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
            
            if(!passwordCorrecto){
                throw new Error('Contraseña incorrecta');
            }

            //Dar acceso ala app

            return {
                token: crearToken(existeUsuario, process.env.SECRETA)
            }

        },
        nuevaPelicula:async(_,{input},ctx) =>{
            // console.log('creeando')
            try{
                const pelicula = new Pelicula(input);

                //asociar pelicula al a creador
                 pelicula.creador = ctx.usuario.id
                // almacenar en la db
                const resultado = await pelicula.save();

                return resultado
            }catch(error){
                console.log(error)
            }
        },
        actualizarPelicula:async(_,{id, input},ctx) =>{
            // revisar si la pelicula existe o no
            let pelicula = await Pelicula.findById(id);

            if (!pelicula){
                throw new Error('Pelicula no encontrada')
            }
                console.log(pelicula)
            // revisar que si la persona trata de editarlo es el creador
            if(pelicula.creador.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales para editar')
            }
            //Guardar la pelicula
            pelicula = await Pelicula.findOneAndUpdate({ _id:id},input, {new:true});
            return pelicula
        },
        eliminarPelicula:async(_,{id},ctx) =>{
              // revisar si la pelicula existe o no
              let pelicula = await Pelicula.findById(id);

              if (!pelicula){
                  throw new Error('Pelicula no encontrada')
              }
                  console.log(pelicula)
              // revisar que si la persona trata de editarlo es el creador
              if(pelicula.creador.toString() !== ctx.usuario.id) {
                  throw new Error('No tienes las credenciales para editar')
              }

              //eliminar
              await Pelicula.findByIdAndDelete({ _id : id});
              return "Pelicula eliminada"
        },
        nuevaSerie:async(_,{input},ctx) => {
           try{
            const serie = new Serie(input);
            serie.creador = ctx.usuario.id;
            const resultado = await serie.save()
            return resultado
           }catch(error){
            console.log(error)
           }
        },
        actualizarSerie:async(_,{id,input},ctx) => {
            // revisar si la serie existe o no
           let serie = await Serie.findById(id);
           if(!serie){
                throw new Error('Serie no encontrada')
           }
        //    revisar si la persona que edita es el creador
        if(serie.creador.toString() !== ctx.usuario.id) {
            throw new Error('No tienes las credenciales para editar')
        }
        
            //gurdar y retornar la tarea
            serie = await Serie.findByIdAndUpdate({_id : id},input, {new:true});
            return serie;
        },
        eliminarSerie:async(_,{id},ctx) => {
            let serie = await Serie.findById(id);
            // revisar si la cosa por hacer existe
            if (!serie){
                throw new Error('Serie no encontrada')
            }
            // revisar que si la persona trata de editarlo es el creador
            if(serie.creador.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales para editar')
            }

            //eliminar
            await Serie.findByIdAndDelete({ _id : id});
            return "Serie eliminada"
        },
        nuevoHacer:async(_,{input},ctx) => {
            try{
                const hacer = new Hacer(input);
                hacer.creador = ctx.usuario.id;
                const resultado = await hacer.save()
                return resultado
            }catch(error){
                console.log(error)
            }
        },
        actualizarHacer: async (_,{id, input}, ctx) =>{
            try {
                // Revisar si la cosa por hacer existe
                let hacer = await Hacer.findById(id);
                if (!hacer) {
                    throw new Error("Cosa por hacer no encontrada");
                }
        
                // // Si la persona que edita no es el creador
                // if (hacer.creador.toString() !== ctx.usuario.id) {
                //     throw new Error("No tienes las credenciales para editar");
                // }
        
                // Actualizar en MongoDB usando $set
                hacer = await Hacer.findByIdAndUpdate(
                    id,
                    { $set: input }, // Aquí se actualizan todos los campos de `input`
                    { new: true }
                );
        
                return hacer;
            } catch (error) {
                console.error("Error al actualizar:", error);
                throw new Error("Hubo un error al actualizar.");
            }
        },
        
        eliminarHacer: async(_,{id},ctx) =>{
            let hacer = await Hacer.findById(id);
            // revisar si la cosa por hacer existe
            if (!hacer){
                throw new Error('Cosa por hacer no encontrada')
            }
            // revisar que si la persona trata de editarlo es el creador
            if(hacer.creador.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales para editar')
            }

            //eliminar
            await Hacer.findByIdAndDelete({ _id : id});
            return "Cosa por hacer eliminada"
        },
        nuevaBebida:async(_,{input},ctx) => {
            try {
            const bebida = new Bebida(input);
            bebida.creador = ctx.usuario.id;
            const resultado = await bebida.save();
            return resultado
            }catch(error){
                console.log(error)
            }
        },
        actualizarBebida:async(_,{id,input},ctx) =>{
            // Revisar si la cosa por haceer existe o no
            let bebida = await Bebida.findById(id);

            if(!bebida){
                throw new Error('Bebida no encontrada')
            }
            //si la persona que edita es el creador
            if(bebida.creador.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales para editar')
            }
            
            bebida = await Bebida.findByIdAndUpdate({_id : id},input, {new:true});
            return bebida;
        },
        eliminarBebida: async(_,{id},ctx) => {
            let bebida = await Bebida.findById(id);
            // revisar si la cosa por hacer existe
            if (!bebida){
                throw new Error('Bebida no encontrada')
            }
            // revisar que si la persona trata de editarlo es el creador
            if(bebida.creador.toString() !== ctx.usuario.id) {
                throw new Error('No tienes las credenciales para editar')
            }

            //eliminar
            await Bebida.findByIdAndDelete({ _id : id});
            return "Bebida eliminada"
        },
        nuevoRestaurante:async(_,{input},ctx) => {
            try{
            const restaurante = new Restaurante(input);
            restaurante.creador = ctx.usuario.id;
            const resultado = await restaurante.save();
            return resultado
            }catch(error){
                console.log(error)
            }
        },
        actualizarRestaurante:async(_,{id,input},ctx) => {
        // Revisar si la cosa por haceer existe o no
        let restaurante = await Restaurante.findById(id);

        if(!restaurante){
            throw new Error('Restaurante no encontrado')
        }
        //si la persona que edita es el creador
        if(restaurante.creador.toString() !== ctx.usuario.id) {
            throw new Error('No tienes las credenciales para editar')
        }

        restaurante = await Restaurante.findByIdAndUpdate({_id : id},input, {new:true});
        return restaurante;
        },
        eliminarRestaurante:async(_,{id},ctx) =>{
        let restaurante = await Restaurante.findById(id);
        // revisar si la cosa por hacer existe
        if (!restaurante){
            throw new Error('Restaurante no encontrado')
        }
        // revisar que si la persona trata de editarlo es el creador
        if(restaurante.creador.toString() !== ctx.usuario.id) {
            throw new Error('No tienes las credenciales para editar')
        }
        //eliminar
        await Restaurante.findByIdAndDelete({ _id : id});
            return "Restaurante eliminado"
        },
        nuevoInbox:async(_,{input},ctx) =>{
            // console.log('creeando')
            try{
                const inbox = new Inbox(input);

                //asociar inbox al a creador
                 inbox.creador = ctx.usuario.id
                // almacenar en la db
                const resultado = await inbox.save();

                return resultado
            }catch(error){
                console.log(error)
            }
        },

    }
}

module.exports = resolvers



