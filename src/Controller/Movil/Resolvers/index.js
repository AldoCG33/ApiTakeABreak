const { mergeTypeDefs } = require('@graphql-tools/merge')
const { mergeResolvers } = require('@graphql-tools/merge')


// Usuarios 
const usuarioResolver = require('./usuarioResolver');
const usuarioSchema = require('../../../Data/Schemas/usuarioSchema');


//chat



//mensajes
const mensajesResolver = require('./mensajesResolver');
const mensajesSchema = require('../../../Data/Schemas/mensajesSchema');



const resolvers = mergeResolvers([
    usuarioResolver,
    mensajesResolver
]);

const typeDefs = mergeTypeDefs([
    usuarioSchema,
    mensajesSchema
]);


module.exports = { resolvers, typeDefs };