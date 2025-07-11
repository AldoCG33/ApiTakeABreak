const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../../Controller/Web/authController');
const { wss } = require('../../Controller/Web/WebS');


// Ruta para registrar usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

// Nuevas rutas para el perfil
router.get('/profile/:userId', getProfile);
router.put('/profile/:userId', updateProfile);

router.post('/wss', )

module.exports = router;
