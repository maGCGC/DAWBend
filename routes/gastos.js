const express = require('express');
const router = express.Router();
const gastosController = require('../controllers/gastosController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/por-cliente', authenticateToken, gastosController.getGastosPorCliente);
router.get('/comparativa', authenticateToken, gastosController.getComparativaIngresosGastos);

module.exports = router;