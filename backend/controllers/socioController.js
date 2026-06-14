const { Op } = require('sequelize'); 
const { Socio } = require('../models'); 

// 1. Leer todos los socios con filtro opcional (GET)
const obtenerSocios = async (req, res, next) => {
    try {
        const { activos } = req.query; 
        let condiciones = {};

        // rq-07: Si piden solo los activos, filtramos fechaVencimiento >= hoy
        if (activos === 'true') {
            const hoy = new Date().toISOString().split('T')[0];
            condiciones = {
                fechaVencimiento: {
                    [Op.gte]: hoy
                }
            };
        }

        const socios = await Socio.findAll({ where: condiciones });
        res.json(socios);
    } catch (error) {
        next(error); // GEN-08: Enviamos el error al manejador central
    }
};

// 2. Crear un nuevo socio (POST)
const crearSocio = async (req, res, next) => {
    try {
        const nuevoSocio = await Socio.create(req.body);
        res.status(201).json({ mensaje: 'Socio creado exitosamente', socio: nuevoSocio });
    } catch (error) {
        next(error);
    }
};

// 3. Actualizar un socio (PUT)
const actualizarSocio = async (req, res, next) => {
    try {
        const { id } = req.params;
        const socio = await Socio.findByPk(id);
        
        if (!socio) {
            return res.status(404).json({ error: 'Socio no encontrado' });
        }

        await socio.update(req.body);
        res.json({ mensaje: 'Socio actualizado', socio });
    } catch (error) {
        next(error);
    }
};

// 4. Eliminar un socio (DELETE)
const eliminarSocio = async (req, res, next) => {
    try {
        const { id } = req.params;
        const socio = await Socio.findByPk(id);

        if (!socio) {
            return res.status(404).json({ error: 'Socio no encontrado' });
        }

        await socio.destroy();
        res.json({ mensaje: 'Socio eliminado correctamente' });
    } catch (error) {
        next(error);
    }
};

module.exports = { obtenerSocios, crearSocio, actualizarSocio, eliminarSocio };