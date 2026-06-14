const express = require('express');
const router = express.Router();
const { inscribirSocio, obtenerInscripciones } = require('../controllers/inscripcionController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.use(verificarToken);

router.get('/', obtenerInscripciones);
router.post('/', inscribirSocio);

module.exports = router;