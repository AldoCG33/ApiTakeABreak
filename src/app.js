const express = require('express'); // Importamos el módulo Express
const app = express(); // Creamos una instancia de la aplicación Express
const PORT = 3000; // Definimos el puerto en el que escuchará el servidor

// Ruta de ejemplo
app.get('/', (req, res) => {
    res.send('¡Hola, mundo desde Express!');
});

// Arrancamos el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
