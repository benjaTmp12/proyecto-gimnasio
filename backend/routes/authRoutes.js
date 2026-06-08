const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { registrarUsuario, loginUsuario } = require('../controllers/authController');

// REGISTRO GEN-04
const validacionesRegistro = [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('email').isEmail().withMessage('Debe ser un email válido'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

router.post('/registro', validacionesRegistro, (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next();
}, registrarUsuario);


// LOGIN GEN-05
const validacionesLogin = [
    check('email').isEmail().withMessage('Debe ser un email válido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria')
];

router.post('/login', validacionesLogin, (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next();
}, loginUsuario);

module.exports = router;