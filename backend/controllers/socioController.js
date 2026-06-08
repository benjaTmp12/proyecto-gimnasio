const { Socio } = require('../models'); 

// 1. Leer todos los socios (GET)
const obtenerSocios = async (req, res) => {
    try {
        const socios = await Socio.findAll();
        res.json(socios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los socios' });
    }
};

// 2. Crear un nuevo socio (POST)
const crearSocio = async (req, res) => {
    try {
        
        const nuevoSocio = await Socio.create(req.body);
        res.status(201).json({ mensaje: 'Socio creado exitosamente', socio: nuevoSocio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el socio' });
    }
};

// 3. Actualizar un socio (PUT)
const actualizarSocio = async (req, res) => {
    try {
        const { id } = req.params;
        const socio = await Socio.findByPk(id);
        
        if (!socio) {
            return res.status(404).json({ error: 'Socio no encontrado' });
        }

        await socio.update(req.body);
        res.json({ mensaje: 'Socio actualizado', socio });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el socio' });
    }
};

// 4. Eliminar un socio (DELETE)
const eliminarSocio = async (req, res) => {
    try {
        const { id } = req.params;
        const socio = await Socio.findByPk(id);

        if (!socio) {
            return res.status(404).json({ error: 'Socio no encontrado' });
        }

        await socio.destroy();
        res.json({ mensaje: 'Socio eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el socio' });
    }
};

module.exports = { obtenerSocios, crearSocio, actualizarSocio, eliminarSocio };