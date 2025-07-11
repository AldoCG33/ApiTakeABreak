const Usuarios = require('../../Data/model/Usuarios');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      contraseña,
      sexo,
      preferences = { generos: [], autores: [] },
      plataforma = []
    } = req.body;

    // Validación básica
    if (!nombre || !apellido || !email || !contraseña || !sexo) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }

    // Verificar si el usuario ya existe
    const existe = await Usuarios.findOne({ email });
    if (existe) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedcontraseña = await bcrypt.hash(contraseña, 10);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuarios({
      nombre,
      apellido,
      email,
      contraseña: hashedcontraseña,
      sexo,
      preferences,
      plataforma
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado con éxito' });

  } catch (error) {
    console.error('Error al registrar:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario', error });
  }
};

const login = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Buscar usuario
    const usuario = await Usuarios.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (!contraseña) {
      return res.status(400).json({ mensaje: 'Falta la contraseña' });
    }

    if (!usuario.contraseña || usuario.contraseña.length < 20) {
      return res.status(500).json({ mensaje: 'La contraseña almacenada no es válida' });
    }


    console.log('contraseña ingresado:', contraseña);
    console.log('contraseña hasheado en BD:', usuario.contraseña);


    // Comparar contraseñas
    const contraseñaOk = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaOk) {
      return res.status(401).json({ mensaje: 'contraseña incorrecta' });
    }

    // Éxito
    res.status(200).json({
      mensaje: 'Inicio de sesión correcto',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        sexo: usuario.sexo,
        preferences: usuario.preferences,
        plataforma: usuario.plataforma,
        fechaCreacion: usuario.fechaCreacion
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error en login', error });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const usuario = await Usuarios.findById(userId).select('-contraseña');
    
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ mensaje: 'Error al obtener perfil' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { nombre, email, contraseña, descripcion } = req.body;

    const usuario = await Usuarios.findById(userId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Actualizar campos básicos
    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (descripcion) usuario.descripcion = descripcion;

    // Si se proporciona nueva contraseña, hashearla
    if (contraseña) {
      usuario.contraseña = await bcrypt.hash(contraseña, 10);
    }

    await usuario.save();

    // Devolver usuario sin contraseña
    const usuarioActualizado = await Usuarios.findById(userId).select('-contraseña');
    res.json({ mensaje: 'Perfil actualizado con éxito', usuario: usuarioActualizado });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ mensaje: 'Error al actualizar perfil' });
  }
};

module.exports = { register, login, getProfile, updateProfile };
