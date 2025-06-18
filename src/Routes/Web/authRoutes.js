const express = require('express');
const router = express.Router();
const { register, login } = require('../../Controller/Web/authController');
const { wss } = require('../../Controller/Web/WebS');


// Ruta para registrar usuario
router.post('/register', register);

// Ruta para iniciar sesión
router.post('/login', login);

router.post('/wss', )

module.exports = router;
