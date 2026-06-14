const { Clase } = require('../models');

// 1. Leer todas las clases
const obtenerClases = async (req, res, next) => {
    try {
        const clases = await Clase.findAll();
        res.json(clases);
    } catch (error) {
        next(error); // GEN-08
    }
};

// 2. Crear clase
const crearClase = async (req, res, next) => {
    try {
        const nuevaClase = await Clase.create(req.body);
        res.status(201).json(nuevaClase);
    } catch (error) {
        next(error); // GEN-08
    }
};

// 3. Actualizar clase
const actualizarClase = async (req, res, next) => {
    try {
        const { id } = req.params;
        const clase = await Clase.findByPk(id);
        
        if (clase) {
            await clase.update(req.body);
            res.json(clase);
        } else {
            res.status(404).json({ error: true, message: 'Clase no encontrada' });
        }
    } catch (error) {
        next(error); // GEN-08
    }
};

// 4. Eliminar clase
const eliminarClase = async (req, res, next) => {
    try {
        const { id } = req.params;
        const eliminado = await Clase.destroy({ where: { id } });
        
        if (eliminado) {
            res.json({ mensaje: 'Clase eliminada' });
        } else {
            res.status(404).json({ error: true, message: 'Clase no encontrada' });
        }
    } catch (error) {
        next(error); // GEN-08
    }
};


// rq-10: REPORTE AVANZADO DE OCUPACIÓN

const reporteOcupacion = async (req, res, next) => {
    try {
        const clases = await Clase.findAll();
        
        // Analizamos la data para generar un estado de ocupación
        const detalle = clases.map(clase => {
            let estado = 'Disponible';
            if (clase.cupos === 0) estado = 'Agotada';
            else if (clase.cupos <= 3) estado = 'Crítica (Por llenarse)';

            return {
                clase: clase.nombre,
                instructor: clase.instructor,
                horario: clase.horario,
                cuposSobrantes: clase.cupos,
                estadoDeAlerta: estado
            };
        });

        const totalCuposDisponibles = clases.reduce((acc, c) => acc + c.cupos, 0);
        const clasesAgotadas = detalle.filter(d => d.estadoDeAlerta === 'Agotada').length;

        res.json({
            mensaje: 'Reporte generado con éxito',
            resumen: {
                totalClases: clases.length,
                cuposGlobalesDisponibles: totalCuposDisponibles,
                clasesAgotadas: clasesAgotadas
            },
            detalle: detalle
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { obtenerClases, crearClase, actualizarClase, eliminarClase, reporteOcupacion };