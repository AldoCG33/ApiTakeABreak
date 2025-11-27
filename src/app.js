const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./Data/Conexion/DB'); // Importar la conexión a MongoDB
const Sync = require('./Data/sync'); // Importar la función de sincronización   
const mainApiRouter = require('./Routes/Web'); // 1. ÚNICA importación para todas las rutas de la API
const initializeWebsockets = require('./Controller/Web/Chat/Service/Websockets'); // 2. Importamos nuestra nueva lógica de WebSockets
//servicios de movil importaciones
const {typeDefs, resolvers} = require('./Controller/Movil/Resolvers/index');
const context = require('./Controller/Movil/Resolvers/context');




//servidor de la parte web 

const app = express();

const startServer = async () => {
  try {
    // --- Conexión y Sincronización ---
    await connectDB();
    console.log('✅ Conexión a la base de datos exitosa.');
    await Sync();
    console.log('✅ Sincronización de modelos completada.');

    // --- Middlewares Generales ---
    app.use(cors());
    app.use(express.json());

    // --- Servir archivos estáticos (imágenes de avatares) ---
    app.use('/public', express.static(path.join(__dirname, '..', 'public')));

    // --- REGISTRO DE RUTAS ---
    // app.js solo conoce al "recepcionista" (mainApiRouter)
    // Todas las rutas de tu API ahora comenzarán con /api/v1
    app.use('/api/v1', mainApiRouter);
    console.log('✅ Rutas de la API registradas en /api/v1');

    // --- Creación del Servidor HTTP ---
    const server = http.createServer(app);

    // --- INICIALIZACIÓN DE WEBSOCKETS ---
    // Llamamos a la función que importamos para que se encargue de la "música"
    initializeWebsockets(server);
    console.log('✅ Servicio de WebSocket inicializado.');

    // --- Iniciar el Servidor ---
    const PORT = process.env.PORTWEB || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo y escuchando en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Error fatal al iniciar el servidor:', error);
    process.exit(1);
  }
};


// servidor de apollo server 
async function startApolloServer() {
  const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    context,
    
  });
  await server.start();
  server.applyMiddleware({ app, path: `/${process.env.SECRETA}/graphql` });

  const PORT = process.env.PORTMOBIL || 10000;
  app.listen(PORT, () => {
    console.log(`GraphQL activo en http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer();
startServer();