const { Clase, Entrenador } = require('../models');
const { Op } = require('sequelize');

// Helper to check for schedule overlaps
const verificarConflictoHorario = async (entrenadorId, horaInicio, horaFin, dias, claseId = null) => {
  const [hIni, mIni] = horaInicio.split(':').map(Number);
  const [hFin, mFin] = horaFin.split(':').map(Number);
  const minInicio = hIni * 60 + mIni;
  const minFin = hFin * 60 + mFin;

  if (minFin <= minInicio) {
    throw new Error('La hora de término debe ser posterior a la hora de inicio.');
  }

  const queryConflicto = { entrenadorId };
  if (claseId) {
    queryConflicto.id = { [Op.ne]: claseId };
  }

  const clasesExistentes = await Clase.findAll({ where: queryConflicto });

  for (const c of clasesExistentes) {
    const diasC = Array.isArray(c.dias) ? c.dias : JSON.parse(c.dias || '[]');
    const coincidenDias = dias.some(d => diasC.includes(d));
    if (coincidenDias) {
      const [cIniH, cIniM] = c.horaInicio.split(':').map(Number);
      const [cFinH, cFinM] = c.horaFin.split(':').map(Number);
      const cMinInicio = cIniH * 60 + cIniM;
      const cMinFin = cFinH * 60 + cFinM;

      // Solapamiento: max(inicioA, inicioB) < min(finA, finB)
      if (Math.max(minInicio, cMinInicio) < Math.min(minFin, cMinFin)) {
        throw new Error(`Conflicto de horario con la clase '${c.nombre}' (${diasC.join(', ')} de ${c.horaInicio} a ${c.horaFin})`);
      }
    }
  }
};

// 1. Leer todas las clases
const obtenerClases = async (req, res, next) => {
  try {
    const clases = await Clase.findAll({
      include: [{
        model: Entrenador,
        as: 'entrenador',
        attributes: ['nombre', 'especialidad', 'estado', 'email', 'telefono']
      }]
    });
    res.json(clases);
  } catch (error) {
    next(error); // GEN-08
  }
};

// 2. Crear clase
const crearClase = async (req, res, next) => {
  try {
    const { nombre, entrenadorId, horaInicio, horaFin, dias, cupos, capacidadMax } = req.body;

    if (!entrenadorId) {
      return res.status(400).json({ error: 'Debes asignar un entrenador a la clase.' });
    }

    const entrenador = await Entrenador.findByPk(entrenadorId);
    if (!entrenador) {
      return res.status(404).json({ error: 'Entrenador no encontrado.' });
    }
    if (entrenador.estado !== 'Activo') {
      return res.status(400).json({ error: 'El entrenador seleccionado no está activo.' });
    }

    try {
      await verificarConflictoHorario(entrenadorId, horaInicio, horaFin, dias);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    // Calcular horario string para compatibilidad hacia atrás
    const horarioStr = `${dias.join(', ')} ${horaInicio} a ${horaFin}`;

    const nuevaClase = await Clase.create({
      nombre,
      instructor: entrenador.nombre,
      horario: horarioStr,
      entrenadorId,
      horaInicio,
      horaFin,
      dias,
      cupos,
      capacidadMax: capacidadMax || cupos || 20
    });

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
      const { nombre, entrenadorId, horaInicio, horaFin, dias, cupos, capacidadMax } = req.body;

      if (!entrenadorId) {
        return res.status(400).json({ error: 'Debes asignar un entrenador a la clase.' });
      }

      const entrenador = await Entrenador.findByPk(entrenadorId);
      if (!entrenador) {
        return res.status(404).json({ error: 'Entrenador no encontrado.' });
      }
      if (entrenador.estado !== 'Activo') {
        return res.status(400).json({ error: 'El entrenador seleccionado no está activo.' });
      }

      try {
        await verificarConflictoHorario(entrenadorId, horaInicio, horaFin, dias, id);
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }

      const horarioStr = `${dias.join(', ')} ${horaInicio} a ${horaFin}`;
      const totalInscritos = (clase.capacidadMax || 20) - clase.cupos;
      const nuevosCupos = Math.max(0, capacidadMax - totalInscritos);

      await clase.update({
        nombre,
        instructor: entrenador.nombre,
        horario: horarioStr,
        entrenadorId,
        horaInicio,
        horaFin,
        dias,
        cupos: nuevosCupos,
        capacidadMax
      });
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
    const clases = await Clase.findAll({
      include: [{ model: Entrenador, as: 'entrenador', attributes: ['nombre', 'especialidad'] }]
    });
    
    const detalle = clases.map(clase => {
      let estado = 'Disponible';
      if (clase.cupos === 0) estado = 'Agotada';
      else if (clase.cupos <= 3) estado = 'Crítica (Por llenarse)';

      return {
        clase: clase.nombre,
        instructor: clase.entrenador ? clase.entrenador.nombre : clase.instructor,
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