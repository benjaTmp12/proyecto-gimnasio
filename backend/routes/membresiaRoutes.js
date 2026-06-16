const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { obtenerMembresias, crearMembresia, actualizarMembresia, eliminarMembresia } = require('../controllers/membresiaController');
const { verificarToken } = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/verificarAdmin');

const validarMembresia = [
    check('tipo').notEmpty().withMessage('El tipo es obligatorio'),
    check('precio').isNumeric().withMessage('El precio debe ser un número'),
    check('duracionDias').isNumeric().withMessage('La duración en días debe ser un número')
];

const validarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ success: false, error: errores.array()[0].msg, errores: errores.array() });
    }
    next();
};

router.use(verificarToken);

router.get('/', obtenerMembresias);
router.post('/', verificarAdmin, validarMembresia, validarErrores, crearMembresia);
router.put('/:id', verificarAdmin, validarMembresia, validarErrores, actualizarMembresia);
router.delete('/:id', verificarAdmin, eliminarMembresia);

module.exports = router;