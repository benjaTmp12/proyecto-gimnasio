const { sequelize, Socio, Clase, Inscripcion } = require('../models');

exports.inscribirSocio = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { socioId, claseId } = req.body;

        const socio = await Socio.findByPk(socioId, { transaction: t });
        if (!socio) {
            await t.rollback();
            return res.status(404).json({ error: 'Socio no encontrado' });
        }

        const hoy = new Date().toISOString().split('T')[0];
        
        if (!socio.fechaVencimiento || socio.fechaVencimiento < hoy) {
            await t.rollback();
            return res.status(409).json({ error: 'Operación denegada', message: 'La membresía del socio está vencida o no registra pagos activos.' });
        }

        const clase = await Clase.findByPk(claseId, { transaction: t });
        if (!clase) {
            await t.rollback();
            return res.status(404).json({ error: 'Clase no encontrada' });
        }
        
        if (clase.cupos <= 0) {
            await t.rollback();
            return res.status(409).json({ error: 'Operación denegada', message: 'La clase ya no tiene cupos disponibles.' });
        }

        const inscripcionExistente = await Inscripcion.findOne({ where: { socioId, claseId, fecha: hoy }, transaction: t });
        if (inscripcionExistente) {
            await t.rollback();
            return res.status(409).json({ error: 'Operación denegada', message: 'El socio ya está inscrito en esta clase hoy.' });
        }

        const nuevaInscripcion = await Inscripcion.create({ socioId, claseId, fecha: hoy }, { transaction: t });
        
        clase.cupos -= 1;
        await clase.save({ transaction: t });

        await t.commit();

        res.status(201).json({ mensaje: 'Inscripción exitosa', inscripcion: nuevaInscripcion, cuposRestantes: clase.cupos });

    } catch (error) {
        if (!t.finished) await t.rollback();
        res.status(400).json({ error: 'Error de solicitud', message: 'Hubo un problema al procesar la inscripción.' });
    }
};

exports.obtenerInscripciones = async (req, res) => {
    try {
        const inscripciones = await Inscripcion.findAll();
        res.json(inscripciones);
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor', message: 'No se pudieron obtener las inscripciones' });
    }
};