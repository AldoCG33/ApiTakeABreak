const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./Data/Conexion/DB'); // Importar la conexión a MongoDB
require('dotenv').config(); // Cargar variables de entorno
//const Sync = require('./Data/sync'); // Importar la función de sincronización
const cors = require('cors');


// Conectar a la base de datos
connectDB();
const app = express();

// Middleware para parsear JSON, debe ir antes de las rutas
app.use(cors()); // 👈 Esta línea permite que tu frontend acceda al backend
app.use(express.json());



const authRoutes = require('./Routes/Web/authRoutes');
app.use('/api/web/auth', authRoutes);

const webRoutes = require('./Routes/Web'); // index.js
app.use('/api/web', webRoutes);

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


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
    console.log(`GraphQL activo en http://localhost:${PORT}${server.graphqlPath}`);
});
}

startApolloServer();
