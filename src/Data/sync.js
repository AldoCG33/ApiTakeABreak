const connectDB = require('./Conexion/DB'); // Importa la conexión a MongoDB
const Usuarios = require('./model/Usuarios');   // Importa el modelo de Usuario

// Función para sincronizar las colecciones en MongoDB
async function syncDatabase() {
  try {
    // Conectar a MongoDB
    await connectDB();
    console.log('Conexión a MongoDB');

    // Crear la colección de usuarios si no existe
    await Usuarios.createCollection();
    console.log(`✅ Colección "${Usuarios.collection.collectionName}" sincronizada.`);

    console.log('🎉 Sincronización de la base de datos completada.');
    process.exit(0); // Finaliza correctamente
  } catch (error) {
    console.error('❌ Error en la sincronización de la base de datos:', error);
    process.exit(1); // Finaliza con error
  }
}
// Ejecutar la sincronización
syncDatabase();

