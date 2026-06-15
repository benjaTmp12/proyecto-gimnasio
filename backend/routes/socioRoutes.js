const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { obtenerSocios, crearSocio, actualizarSocio, eliminarSocio } = require('../controllers/socioController');
const { verificarToken } = require('../middlewares/authMiddleware');

const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ error: true, errores: errores.array() });
    }
    next();
};

router.use(verificarToken);

// Obtener socios
router.get('/', obtenerSocios);

// Crear socio (con GEN-10)
router.post('/', [
    check('rut').notEmpty().withMessage('El RUT es obligatorio'),
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('apellido').notEmpty().withMessage('El apellido es obligatorio'),
    check('email').isEmail().withMessage('Debe ser un email válido'),
    validarCampos
], crearSocio);

// Actualizar socio (con GEN-10)
router.put('/:id', [
    check('rut').notEmpty().withMessage('El RUT es obligatorio'),
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('apellido').notEmpty().withMessage('El apellido es obligatorio'),
    check('email').isEmail().withMessage('Debe ser un email válido'),
    validarCampos
], actualizarSocio);

// Eliminar socio
router.delete('/:id', eliminarSocio);

module.exports = router;