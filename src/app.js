const express = require('express');
const http = require('http');           
const WebSocket = require('ws');        
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./Data/Conexion/DB'); // Importar la conexión a MongoDB
require('dotenv').config({path:'.env'}); // Cargar variables de entorno
const Sync = require('./Data/sync'); // Función de sincronización
const cors = require('cors');

//  Conectar a la base de datos
connectDB();
const app = express();

//  Middleware
app.use('/uploads', express.static('../public/AVATARES'))
app.use(cors());
app.use(express.json());

//  Sincronización inicial
(async () => {
  await Sync();
})();

//  Rutas
const authRoutes = require('./Routes/Web/authRoutes');
app.use('/api/web/', authRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

//  Crear servidor HTTP y WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
require('./Controller/Web/WebS')(wss);

//  Apollo Server (Movil)
const {typeDefs, resolvers} = require('./Controller/Movil/Resolvers/index');
const context = require('./Controller/Movil/Resolvers/context');

async function startApolloServer() {
  const apolloServer = new ApolloServer({ 
    typeDefs,
    resolvers,
    context,
  });
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: `/${process.env.SECRETA}/graphql` });
}

startApolloServer();

//  Usar puerto 3001 (web + websocket)
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Servidor Express + WebSocket corriendo en puerto ${PORT}`);
  console.log(`GraphQL activo en http://localhost:${PORT}/${process.env.SECRETA}/graphql`);
});
