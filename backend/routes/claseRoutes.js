const express = require('express');
const router = express.Router();
const { obtenerClases, crearClase, actualizarClase, eliminarClase, reporteOcupacion } = require('../controllers/claseController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.use(verificarToken);

// rq-10: Ruta del reporte 
router.get('/reporte-ocupacion', reporteOcupacion);

router.get('/', obtenerClases);
router.post('/', crearClase);
router.put('/:id', actualizarClase);
router.delete('/:id', eliminarClase);

module.exports = router;