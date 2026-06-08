const { Membresia } = require('../models');

exports.obtenerMembresias = async (req, res) => {
    try {
        const membresias = await Membresia.findAll();
        res.json(membresias);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener membresías' });
    }
};

exports.crearMembresia = async (req, res) => {
    try {
        const membresia = await Membresia.create(req.body);
        res.status(201).json(membresia);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la membresía' });
    }
};

exports.eliminarMembresia = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Membresia.destroy({ where: { id } });
        if (eliminado) {
            res.json({ mensaje: 'Membresía eliminada' });
        } else {
            res.status(404).json({ error: 'Membresía no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
};
exports.actualizarMembresia = async (req, res) => {
    try {
        const { id } = req.params;
        const membresia = await Membresia.findByPk(id);
        
        if (membresia) {
            await membresia.update(req.body);
            res.json(membresia);
        } else {
            res.status(404).json({ error: 'Membresía no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar la membresía' });
    }
};