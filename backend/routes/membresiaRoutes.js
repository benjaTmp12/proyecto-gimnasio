const express = require('express');
const router = express.Router();
const { obtenerMembresias, crearMembresia, actualizarMembresia, eliminarMembresia } = require('../controllers/membresiaController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.use(verificarToken);

router.get('/', obtenerMembresias);
router.post('/', crearMembresia);
router.put('/:id', actualizarMembresia);
router.delete('/:id', eliminarMembresia);

module.exports = router;