const { Clase } = require('../models');

exports.obtenerClases = async (req, res) => {
    try {
        const clases = await Clase.findAll();
        res.json(clases);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las clases' });
    }
};

exports.crearClase = async (req, res) => {
    try {
        const nuevaClase = await Clase.create(req.body);
        res.status(201).json(nuevaClase);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear la clase' });
    }
};

exports.actualizarClase = async (req, res) => {
    try {
        const { id } = req.params;
        const clase = await Clase.findByPk(id);
        
        if (clase) {
            await clase.update(req.body);
            res.json(clase);
        } else {
            res.status(404).json({ error: 'Clase no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar la clase' });
    }
};

exports.eliminarClase = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Clase.destroy({ where: { id } });
        
        if (eliminado) {
            res.json({ mensaje: 'Clase eliminada' });
        } else {
            res.status(404).json({ error: 'Clase no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la clase' });
    }
};