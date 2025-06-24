/*
const connectDB = require('./Conexion/DB'); // Importa la conexión a MongoDB
const Usuario = require('./model/User');   // Importa el modelo de Usuario

// Función para sincronizar las colecciones en MongoDB
async function syncDatabase() {
  try {
    await connectDB();
    console.log('Conexión a MongoDB');

    // Crear la colección de usuarios si no existe
    await Usuario.createCollection();
    console.log(`✅ Colección "${Usuario.collection.collectionName}" sincronizada.`);

    console.log('✅ Sincronización de la base de datos completada.');
  } catch (error) {
    console.error('❌ Error en la sincronización de la base de datos:', error);
  }
}
module.exports = syncDatabase; */