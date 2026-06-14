const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); 
const { Usuario } = require('../models');

// GEN-04: 
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

// GEN-05: 
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

        //  Usa JWT_SECRET desde variables de entorno (GEN-02)
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

// GEN-07: Solicitar token de recuperación
const solicitarResetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            // Por seguridad, siempre devolvemos OK para no revelar si el correo existe en la base de datos
            return res.status(200).json({ mensaje: 'Si el correo existe, se enviará un token.' });
        }

        // Generar un token aleatorio y darle 1 hora de vida
        const resetToken = crypto.randomBytes(20).toString('hex');
        usuario.resetToken = resetToken;
        usuario.resetTokenExpires = Date.now() + 3600000; // 1 hora en milisegundos
        await usuario.save();

        // Mostrar token en consola (permitido en modo dev según requerimientos)
        console.log('\n=============================================');
        console.log(`🔑 TOKEN DE RECUPERACIÓN PARA ${email}:`);
        console.log(resetToken);
        console.log('=============================================\n');

        res.status(200).json({ mensaje: 'Token generado (Revisar consola del servidor)' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al solicitar reseteo' });
    }
};

// GEN-07: Validar token y cambiar contraseña
const resetearPassword = async (req, res) => {
    try {
        const { token, nuevaPassword } = req.body;

        const usuario = await Usuario.findOne({ where: { resetToken: token } });

        // Validar que el usuario exista con ese token y que la fecha no haya expirado
        if (!usuario || usuario.resetTokenExpires < new Date()) {
            return res.status(400).json({ error: 'El token es inválido o ha expirado.' });
        }

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(nuevaPassword, salt);
        
        // Limpiar los campos del token en la base de datos
        usuario.resetToken = null;
        usuario.resetTokenExpires = null;
        await usuario.save();

        res.status(200).json({ mensaje: 'Contraseña actualizada correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
};

// Exportamos todas las funciones juntas al estilo de tu código
module.exports = { registrarUsuario, loginUsuario, solicitarResetPassword, resetearPassword };