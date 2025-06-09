const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./Data/Conexion/DB'); // Importar la conexión a MongoDB
require('dotenv').config({path:'.env'}); // Cargar variables de entorno
// const Sync = require('./Data/sync'); // Importar la función de sincronización   


// Conectar a la base de datos
connectDB();
const app = express();

app.use(express.json()); // Middleware para parsear JSON

app.get('/', (req, res) => {
    res.send('API funcionando');
});


//servicios de movil importaciones
const {typeDefs, resolvers} = require('./Controller/Movil/Resolvers/index');
const context = require('./Controller/Movil/Resolvers/context');




async function startApolloServer() {
  const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    context,
    
  });
  await server.start();
  server.applyMiddleware({ app, path: `/${process.env.SECRETA}/graphql` });

  const PORT = process.env.PORT || 10000;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`GraphQL activo en http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer();