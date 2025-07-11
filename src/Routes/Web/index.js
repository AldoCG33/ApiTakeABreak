const express = require('express');
const router = express.Router();
const Usuarios = require('../../Data/model/Usuarios'); // Asegúrate que la ruta sea correcta

// Ruta de prueba
router.get('/saludo', (req, res) => {
  res.json({ mensaje: '¡Hola desde Web API!' });
});

// 👉 Ruta real: obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuarios.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Ruta para obtener usuarios activos
router.get('/usuarios/activos', async (req, res) => {
  try {
    const usuarios = await Usuarios.find().select('-contraseña');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios activos' });
  }
});

module.exports = router;
