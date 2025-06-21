const { gql } = require('apollo-server-express');

const typeDefs = gql`

    # Tipo para cada mensaje del chat
    type MensajeChat {
    rol: String
    texto: String
    }

    # Tipo para todo el historial de conversación
    type ChatbotMovil {
    id: ID
    usuarioId: ID
    mensaje: [MensajeChat]
    fecha: String
    }

    type Query {
    obtenerChatPorUsuario(usuarioId: ID!): [ChatbotMovil]
    }

    # Input para un mensaje individual
    input MensajeChatInput {
    rol: String!
    texto: String!
    }

    # Input para guardar un historial completo (o agregar mensajes)
    input ChatbotMovilInput {
    mensaje: [MensajeChatInput]!
    }
    

    type Mutation {
    guardarMensajesChat(input: ChatbotMovilInput!): ChatbotMovil
    }

`;

module.exports = typeDefs;
