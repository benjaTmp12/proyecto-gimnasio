const express = require('express');
const router = express.Router();
const { obtenerSocios, crearSocio, actualizarSocio, eliminarSocio } = require('../controllers/socioController');
const { verificarToken } = require('../middlewares/authMiddleware');

// IMPORTANTE: Aplicamos el middleware a TODAS las rutas de este archivo
router.use(verificarToken);

router.get('/', obtenerSocios);
router.post('/', crearSocio);
router.put('/:id', actualizarSocio);
router.delete('/:id', eliminarSocio);

module.exports = router;