const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type MensajeChat {
        rol: String
        texto: String
        fecha: String
    }

    type ChatbotMovil {
        id: ID
        usuarioId: ID
        mensaje: [MensajeChat]
        fecha: String
    }

    type UsuarioAutenticado {
        id: ID
        email: String
        nombre: String
        apellido: String
    }

    type Token {
        token: String
        usuario: UsuarioAutenticado
    }

    type Query {
        obtenerChatPorUsuario: [ChatbotMovil]
        obtenerUsuarios: [Usuarios]
    }

    input MensajeChatInput {
        rol: String!
        texto: String!
    }

    input ChatbotMovilInput {
        mensaje: [MensajeChatInput]!
    }

    input UsuariosInput {
        nombre: String!
        apellido: String!
        edad: Int!
        sexo: String!
        email: String!
        password: String!
        preferences: PreferenciasInput
        plataforma: [String]
    }

    input PreferenciasInput {
        generos: [String]
        autores: [String]
    }

    input AutenticarInput {
        email: String!
        password: String!
    }

    type Mutation {
         guardarMensajesChat(input: ChatbotMovilInput! conversationId: ID ): ChatbotMovil
        crearUsuarios(input: UsuariosInput): String
        autenticarUsuarios(input: AutenticarInput): Token
    }

    type Preferencias {
        generos: [String]
        autores: [String]
    }

    type Usuarios {
        id: ID
        nombre: String!
        apellido: String!
        edad: Int!
        sexo: String!
        email: String!
        fechaCreacion: String
        preferences: Preferencias
        plataforma: [String]
    }
`;

module.exports = typeDefs;