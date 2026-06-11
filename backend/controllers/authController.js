const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

// GEN-04: Registro de usuario
const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const existeUsuario = await Usuario.findOne({ where: { email } });
        if (existeUsuario) {
            return res.status(409).json({ error: 'El email ya está en uso' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nuevoUsuario = await Usuario.create({ nombre, email, password: hashedPassword });

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, email: nuevoUsuario.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno al registrar el usuario' });
    }
};

// GEN-05: Login y emisión JWT
const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // ✅ Usa JWT_SECRET desde variables de entorno (GEN-02)
        const token = jwt.sign(
            { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno al iniciar sesión' });
    }
};

module.exports = { registrarUsuario, loginUsuario };