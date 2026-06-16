const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { verificarToken } = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/verificarAdmin');
const { Entrenador } = require('../models');

// Entrenadores con horarios fijos (seed inicial — solo admin puede modificar)
const ENTRENADORES_SEED = [
  {
    nombre: 'Juan "La Roca" Pérez',
    especialidad: 'Musculación y Fuerza',
    horarios: [
      { dia: 'Lunes', horas: ['07:00', '09:00', '18:00'] },
      { dia: 'Miércoles', horas: ['07:00', '09:00', '18:00'] },
      { dia: 'Viernes', horas: ['07:00', '09:00'] }
    ]
  },
  {
    nombre: 'María "Espartana" Gómez',
    especialidad: 'CrossFit y Funcional',
    horarios: [
      { dia: 'Martes', horas: ['07:00', '18:00', '20:00'] },
      { dia: 'Jueves', horas: ['07:00', '18:00', '20:00'] },
      { dia: 'Sábado', horas: ['09:00', '11:00'] }
    ]
  },
  {
    nombre: 'Pedro "Ironman" Silva',
    especialidad: 'Cardio y Spinning',
    horarios: [
      { dia: 'Lunes', horas: ['06:00', '17:00'] },
      { dia: 'Martes', horas: ['06:00', '17:00'] },
      { dia: 'Viernes', horas: ['06:00', '17:00', '19:00'] }
    ]
  },
  {
    nombre: 'Camila "Destructora" Rojas',
    especialidad: 'Yoga y Pilates',
    horarios: [
      { dia: 'Miércoles', horas: ['10:00', '12:00', '20:00'] },
      { dia: 'Viernes', horas: ['10:00', '12:00', '20:00'] },
      { dia: 'Sábado', horas: ['10:00', '12:00'] }
    ]
  }
];

// GET /api/entrenadores — todos los usuarios autenticados
router.get('/', verificarToken, async (req, res, next) => {
  try {
    let entrenadores = await Entrenador.findAll({ order: [['nombre', 'ASC']] });
    // Si no hay entrenadores, insertar el seed inicial
    if (entrenadores.length === 0) {
      entrenadores = await Entrenador.bulkCreate(ENTRENADORES_SEED);
    }
    res.json(entrenadores);
  } catch (error) {
    next(error);
  }
});

const validarEntrenador = [
  check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  check('especialidad').notEmpty().withMessage('La especialidad es obligatoria')
];
const validarErrores = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ success: false, error: errores.array()[0].msg });
  next();
};

// POST /api/entrenadores — solo admin
router.post('/', verificarToken, verificarAdmin, validarEntrenador, validarErrores, async (req, res, next) => {
  try {
    const { nombre, especialidad, horarios } = req.body;
    const entrenador = await Entrenador.create({ nombre, especialidad, horarios: horarios || [] });
    res.status(201).json(entrenador);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/entrenadores/:id — solo admin
router.delete('/:id', verificarToken, verificarAdmin, async (req, res, next) => {
  try {
    const eliminado = await Entrenador.destroy({ where: { id: req.params.id } });
    if (eliminado) res.json({ mensaje: 'Entrenador eliminado' });
    else res.status(404).json({ error: 'Entrenador no encontrado' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
