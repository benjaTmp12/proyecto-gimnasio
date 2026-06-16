const { Entrenador, Clase, Inscripcion, Socio } = require('../models');
const { Op } = require('sequelize');

const obtenerStats = async (req, res, next) => {
  try {
    // 1. Entrenadores
    const totalEntrenadores = await Entrenador.count();
    const entrenadoresActivos = await Entrenador.count({ where: { estado: 'Activo' } });

    // 2. Clases
    const totalClases = await Clase.count();
    const clasesDisponibles = await Clase.count({ where: { cupos: { [Op.gt]: 0 } } });
    const clasesCompletas = await Clase.count({ where: { cupos: 0 } });

    // 3. Próximas clases del día
    // Obtenemos el día de hoy en español
    const diasEsp = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoyIndice = new Date().getDay();
    const diaHoy = diasEsp[hoyIndice];

    const todasLasClases = await Clase.findAll({
      include: [
        { model: Entrenador, as: 'entrenador', attributes: ['nombre', 'especialidad'] },
        { model: Inscripcion, as: 'inscripciones' }
      ]
    });

    const clasesDeHoy = todasLasClases.filter(clase => {
      let diasArr = [];
      try {
        diasArr = Array.isArray(clase.dias) ? clase.dias : JSON.parse(clase.dias || '[]');
      } catch (e) {
        diasArr = [];
      }
      return diasArr.includes(diaHoy);
    }).map(clase => {
      return {
        id: clase.id,
        nombre: clase.nombre,
        instructor: clase.entrenador ? clase.entrenador.nombre : clase.instructor,
        especialidad: clase.entrenador ? clase.entrenador.especialidad : '',
        horario: clase.horario,
        horaInicio: clase.horaInicio,
        horaFin: clase.horaFin,
        cupos: clase.cupos,
        capacidadMax: clase.capacidadMax,
        inscritosCount: clase.inscripciones ? clase.inscripciones.length : 0
      };
    });

    // Ordenar próximas clases de hoy por horaInicio
    clasesDeHoy.sort((a, b) => (a.horaInicio || '').localeCompare(b.horaInicio || ''));

    // 4. Entrenadores con más alumnos asignados
    // Buscamos todos los entrenadores y calculamos la suma total de inscripciones en sus clases
    const entrenadoresConAlumnos = await Entrenador.findAll({
      include: [
        {
          model: Clase,
          as: 'clases',
          include: [{ model: Inscripcion, as: 'inscripciones' }]
        }
      ]
    });

    const rankingEntrenadores = entrenadoresConAlumnos.map(e => {
      let totalAlumnos = 0;
      if (e.clases) {
        e.clases.forEach(c => {
          if (c.inscripciones) {
            totalAlumnos += c.inscripciones.length;
          }
        });
      }
      return {
        id: e.id,
        nombre: e.nombre,
        especialidad: e.especialidad,
        estado: e.estado,
        totalAlumnos
      };
    });

    // Ordenar descendentemente por totalAlumnos
    rankingEntrenadores.sort((a, b) => b.totalAlumnos - a.totalAlumnos);

    res.json({
      stats: {
        totalEntrenadores,
        entrenadoresActivos,
        totalClases,
        clasesDisponibles,
        clasesCompletas
      },
      clasesDeHoy,
      rankingEntrenadores: rankingEntrenadores.slice(0, 5) // Top 5
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { obtenerStats };
