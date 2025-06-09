const { mergeTypeDefs } = require('@graphql-tools/merge')
const { mergeResolvers } = require('@graphql-tools/merge')


// Usuarios 
const usuarioResolver = require('./usuarioResolver');
const usuarioSchema = require('../../../Data/Schemas/usuarioSchema');

//chat


//mensajes



const resolvers = mergeResolvers([
    usuarioResolver
]);

const typeDefs = mergeTypeDefs([
    usuarioSchema
]);


module.exports = { resolvers, typeDefs };