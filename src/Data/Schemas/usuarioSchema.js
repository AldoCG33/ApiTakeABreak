const { gql } = require('apollo-server-express');

const typeDefs = gql`

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

    type Token {
        token: String
    }

    type Query {
        obtenerUsuarios: [Usuarios]
    }

    input PreferenciasInput {
        generos: [String]
        autores: [String]
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

    input AutenticarInput {
        email: String!
        password: String!
    }

    type Mutation {
        crearUsuarios(input: UsuariosInput): String
        autenticarUsuarios(input: AutenticarInput): Token
    }
`;

module.exports = typeDefs;
