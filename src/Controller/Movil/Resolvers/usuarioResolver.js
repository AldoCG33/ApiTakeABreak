const Usuarios = require('../../../Data/model/Usuarios');
const bcryptjs = require('bcryptjs');
const crearToken = require('../utils/crearToken');

const usuarioResolver = {
    Query: {
        obtenerUsuarios: async (_, {}, ctx) => {
            // Verificar autenticación
            if (!ctx.usuarios || !ctx.usuarios.id) {
                throw new Error('No autorizado');
            }
            
            const usuarios = await Usuarios.find();
            return usuarios;
        }
    },

    Mutation: {
        crearUsuarios: async (_, { input }) => {
            const { email, password } = input;

            const existeUsuarios = await Usuarios.findOne({ email });
            if (existeUsuarios) {
                throw new Error('El usuario ya esta registrado');
            }

            try {
                // Hasheear password
                const salt = await bcryptjs.genSalt(10);
                input.password = await bcryptjs.hash(password, salt);
        
                // Registrar nuevo usuario
                const nuevoUsuarios = new Usuarios(input);
                await nuevoUsuarios.save();
                return "Usuario Creado Correctamente";
            } catch (error) {
                throw new Error('Error al crear el usuario');
            }
        },

        autenticarUsuarios: async (_, { input }) => {
            const { email, password } = input;

            // Si el usuario existe
            const existeUsuarios = await Usuarios.findOne({ email });
            if (!existeUsuarios) {
                throw new Error('El usuario no existe');
            }

            // Si el password es correcto
            const passwordCorrecto = await bcryptjs.compare(password, existeUsuarios.password);
            if (!passwordCorrecto) {
                throw new Error('Contraseña incorrecta');
            }

            // Dar acceso a la app
            return {
                token: crearToken(existeUsuarios, process.env.SECRETA, '1000h'),
                usuario: {
                    id: existeUsuarios._id,
                    email: existeUsuarios.email,
                    nombre: existeUsuarios.nombre,
                    apellido: existeUsuarios.apellido
                }
            };
        },
    }
};

module.exports = usuarioResolver;