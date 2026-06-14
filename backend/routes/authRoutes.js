const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { registrarUsuario, loginUsuario, solicitarResetPassword, resetearPassword } = require('../controllers/authController');

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

// RECUPERACIÓN DE CONTRASEÑA (GEN-07)


const validacionesForgot = [
    check('email').isEmail().withMessage('Debe proporcionar un email válido')
];

router.post('/forgot-password', validacionesForgot, (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next();
}, solicitarResetPassword);

const validacionesReset = [
    check('token').notEmpty().withMessage('El token es obligatorio'),
    check('nuevaPassword').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
];

router.post('/reset-password', validacionesReset, (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    next();
}, resetearPassword);

module.exports = router;