const {gql} = require('apollo-server-express');

const typeDefs = gql `


    type Usuarios {
    id: ID
    nombre: String!
    apellido: String!
    edad: String!
    seco: String!
    email: String!
    }

    type Token {
    token:String
    }

    type Query {
    obtenerUsuarios:[Usuarios]
    }


    input UsuariosInput{
    nombre:String!
    apellido:String!
    edad:String!
    seco:String!
    email:String!
    password:String!
    }

    input AutenticarInput{
    email:String
    password:String

    }


    type Mutation {
        #Usuarios
        crearUsuarios(input: UsuariosInput) : String
        autenticarUsuarios(input: AutenticarInput) : Token
    }
`


module.exports = typeDefs