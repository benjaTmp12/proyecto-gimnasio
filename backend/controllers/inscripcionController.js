const { Socio, Clase, Inscripcion } = require('../models');

exports.inscribirSocio = async (req, res) => {
    try {
        const { socioId, claseId } = req.body;

        // 1. Buscar al socio
        const socio = await Socio.findByPk(socioId);
        if (!socio) return res.status(404).json({ error: 'Socio no encontrado' });

      
        const hoy = new Date().toISOString().split('T')[0]; // Obtiene la fecha actual en formato YYYY-MM-DD
        
        // Si no tiene fecha o la fecha ya pasó, tiramos el error 409 (Conflicto)
        if (!socio.fechaVencimiento || socio.fechaVencimiento < hoy) {
            return res.status(409).json({ 
                error: 'Operación denegada', 
                message: 'La membresía del socio está vencida o no registra pagos activos.' 
            });
        }

        // 2. Buscar la clase
        const clase = await Clase.findByPk(claseId);
        if (!clase) return res.status(404).json({ error: 'Clase no encontrada' });
        
        // Validar que queden cupos
        if (clase.cupos <= 0) {
            return res.status(409).json({ error: 'Operación denegada', message: 'La clase ya no tiene cupos disponibles.' });
        }

       
        // A) Creamos la inscripción
        const nuevaInscripcion = await Inscripcion.create({ socioId, claseId, fecha: hoy });
        
        // B) Restamos 1 cupo a la clase y guardamos
        clase.cupos -= 1;
        await clase.save();

        res.status(201).json({ 
            mensaje: 'Inscripción exitosa', 
            inscripcion: nuevaInscripcion,
            cuposRestantes: clase.cupos
        });

    } catch (error) {
        // GEN-08 y GEN-10: Respuesta de error limpia sin mostrar código fuente
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