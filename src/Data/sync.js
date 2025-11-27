const connectDB = require('./Conexion/DB');
const Usuarios = require('./model/Usuarios');
const Emociones = require('./model/Emociones');
const Recomendacion = require('./model/Recomendaciones');
const ChatMovil = require('./model/ChatMovil');
const ChatWeb = require('./model/ChatWeb');
const Retroalimentacion = require('./model/Retroalimentacion');

async function syncDatabase() {
  try {
    await connectDB();
    console.log('Conexión a MongoDB');

    const models = [Usuarios, Emociones, Recomendacion, ChatMovil, ChatWeb, Retroalimentacion];

    for (const model of models) {
      await model.createCollection();
      console.log(` Colección "${model.collection.collectionName}" sincronizada.`);
    }

    console.log('✅ Sincronización de la base de datos completada.');
  } catch (error) {
    console.error('❌ Error en la sincronización de la base de datos:', error);
  }
}
module.exports = syncDatabase;
