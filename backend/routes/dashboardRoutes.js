const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/authMiddleware');
const { obtenerStats } = require('../controllers/dashboardController');

// GET /api/dashboard/stats — cualquier usuario autenticado
router.get('/stats', verificarToken, obtenerStats);

module.exports = router;
