const Usuarios = require('../../../Data/model/Usuarios');
const bcryptjs = require('bcryptjs');
const crearToken = require('../utils/crearToken');
const { fetchSpotifyCategories } = require('./utils/spotify');

const usuarioResolver = {
  Query: {
    obtenerUsuarios: async (_, __, ctx) => {
      if (!ctx.usuarios || !ctx.usuarios.id) {
        throw new Error('No autorizado');
      }
      const usuarios = await Usuarios.find({ _id: ctx.usuarios.id });
      return usuarios;
    },

    // ---- NUEVO: Spotify desde backend ----
    listarSpotifyGeneros: async (_, { limit, locale }, ctx) => {
      // Si quieres exigir auth para listar, descomenta:
      // if (!ctx.usuarios || !ctx.usuarios.id) throw new Error('No autorizado');
      return await fetchSpotifyCategories({ limit, locale });
    },
  },

  Mutation: {
    crearUsuarios: async (_, { input }) => {
      const { email, password } = input;

      const existeUsuarios = await Usuarios.findOne({ email });
      if (existeUsuarios) throw new Error('El usuario ya esta registrado');

      try {
        const salt = await bcryptjs.genSalt(10);
        input.password = await bcryptjs.hash(password, salt);

        const nuevoUsuarios = new Usuarios(input);
        await nuevoUsuarios.save();
        return "Usuario Creado Correctamente";
      } catch (error) {
        throw new Error('Error al crear el usuario');
      }
    },

    autenticarUsuarios: async (_, { input }) => {
      const { email, password } = input;

      const existeUsuarios = await Usuarios.findOne({ email });
      if (!existeUsuarios) throw new Error('El usuario no existe');

      const passwordCorrecto = await bcryptjs.compare(password, existeUsuarios.password);
      if (!passwordCorrecto) throw new Error('Contraseña incorrecta');

      return {
        token: crearToken(existeUsuarios, process.env.SECRETA, '1000h'),
      };
    },

    actualizarPreferenciasUsuario: async (_, { input }, ctx) => {
      if (!ctx.usuarios || !ctx.usuarios.id) {
        throw new Error('No autorizado');
      }

      // Solo vamos a tocar preferences.generos si viene en input
      const update = {};
      if (input?.generos) {
        update['preferences.generos'] = input.generos;
      }
      if (input?.autores) {
        update['preferences.autores'] = input.autores;
      }

      const user = await Usuarios.findByIdAndUpdate(
        ctx.usuarios.id,
        { $set: update },
        { new: true }
      );

      if (!user) throw new Error('Usuario no encontrado');
      return user;
    },
  },
};

module.exports = usuarioResolver;
