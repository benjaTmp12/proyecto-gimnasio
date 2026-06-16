const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { obtenerClases, crearClase, actualizarClase, eliminarClase, reporteOcupacion } = require('../controllers/claseController');
const { verificarToken } = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/verificarAdmin');

const validarClase = [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('instructor').notEmpty().withMessage('El instructor es obligatorio'),
    check('horario').notEmpty().withMessage('El horario es obligatorio'),
    check('cupos').isInt({ min: 0 }).withMessage('Los cupos deben ser un número positivo o cero')
];

const validarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ success: false, error: errores.array()[0].msg, errores: errores.array() });
    }
    next();
};

router.use(verificarToken);

// rq-10: Ruta del reporte 
router.get('/reporte-ocupacion', reporteOcupacion);

router.get('/', obtenerClases);
router.post('/', verificarAdmin, validarClase, validarErrores, crearClase);
router.put('/:id', verificarAdmin, validarClase, validarErrores, actualizarClase);
router.delete('/:id', verificarAdmin, eliminarClase);

module.exports = router;