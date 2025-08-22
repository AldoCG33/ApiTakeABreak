const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, getAvatars, fetchActiveUsers } = require('../../Controller/Web/authController');
const { wss } = require('../../Controller/Web/WebS');


// Ruta para registrar usuario
router.post('/register', register);


// Ruta para iniciar sesión
router.post('/login', login);

// Nuevas rutas para el perfil
router.get ( '/usuarios/activos', fetchActiveUsers)
router.get('/profile/:userId', getProfile);
router.put('/profile/:userId', updateProfile);

router.post('/wss', )

//Ruta para las imagenes de los avatares
router.get('/avatars', getAvatars);

module.exports = router;
