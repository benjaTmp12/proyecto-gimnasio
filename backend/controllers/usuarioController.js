const { Usuario } = require('../models');
const { hashPassword } = require('../utils/hash');

exports.obtenerUsuarios = async (req, res) => {
    try {
        // Excluimos la contraseña para que no viaje al frontend por seguridad
        const usuarios = await Usuario.findAll({ attributes: { exclude: ['password', 'resetToken', 'resetTokenExpires'] } });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

exports.crearUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        
        // Encriptar la contraseña antes de guardar
        const hashedPassword = await hashPassword(password);
        
        const usuario = await Usuario.create({ nombre, email, password: hashedPassword });
        res.status(201).json({ id: usuario.id, nombre: usuario.nombre, email: usuario.email });
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el usuario. Quizás el email ya existe.' });
    }
};

exports.actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, password } = req.body;
        const usuario = await Usuario.findByPk(id);
        
        if (usuario) {
            const datosActualizados = { nombre, email };
            
            // Si el admin escribió una nueva contraseña, la encriptamos. Si la dejó vacía, no la tocamos.
            if (password) {
                datosActualizados.password = await hashPassword(password);
            }
            
            await usuario.update(datosActualizados);
            res.json({ mensaje: 'Usuario actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el usuario' });
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Usuario.destroy({ where: { id } });
        if (eliminado) {
            res.json({ mensaje: 'Usuario eliminado' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
};