const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { obtenerUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } = require('../controllers/usuarioController');
const { verificarToken } = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/verificarAdmin');

const validarUsuario = [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('email').isEmail().withMessage('El email debe ser válido')
];

const validarErrores = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ success: false, error: errores.array()[0].msg, errores: errores.array() });
    }
    next();
};

router.use(verificarToken);

router.get('/', verificarAdmin, obtenerUsuarios);
router.post('/', verificarAdmin, validarUsuario, validarErrores, crearUsuario);
router.put('/:id', verificarAdmin, validarUsuario, validarErrores, actualizarUsuario);
router.delete('/:id', verificarAdmin, eliminarUsuario);

module.exports = router;