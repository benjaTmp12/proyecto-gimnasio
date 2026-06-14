const express = require('express');
const router = express.Router();
const { obtenerClases, crearClase, actualizarClase, eliminarClase } = require('../controllers/claseController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Proteger todas las rutas de clases
router.use(verificarToken);

router.get('/', obtenerClases);
router.post('/', crearClase);
router.put('/:id', actualizarClase);
router.delete('/:id', eliminarClase);

module.exports = router;