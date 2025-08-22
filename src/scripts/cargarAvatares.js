const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Avatar = require('../Data/model/Avatar');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

console.log('MONGO_URI:', process.env.MONGO_URI); // Para verificar carga env

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const avatarsFolder = path.join(__dirname, '../../public/AVATARES');

async function cargarAvatares() {
  try {
    const archivos = fs.readdirSync(avatarsFolder);

    const avatars = archivos
      .filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file))
      .map(file => ({
        name: path.parse(file).name,
        url: `/public/avatars/${file}`,
      }));

    await Avatar.deleteMany(); // Opcional: elimina anteriores
    await Avatar.insertMany(avatars);

    console.log('✅ Avatares cargados correctamente');
    mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error al cargar avatares:', error);
    mongoose.disconnect();
  }
}

cargarAvatares();
