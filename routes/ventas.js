const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');
const authenticateToken = require('../middlewares/authenticateToken'); // Asegúrate de tener este middleware

// Obtener todas las ventas
router.get('/', authenticateToken, ventasController.getAllVentas);

router.get('/summary', authenticateToken, ventasController.getVentasSummary);

// Obtener una venta por ID
router.get('/:id', authenticateToken, ventasController.getVentaById);

// Crear una nueva venta
router.post('/', authenticateToken, ventasController.createVenta);

// Actualizar una venta
router.put('/:id', authenticateToken, ventasController.updateVenta);

// Eliminar una venta
router.delete('/:id', authenticateToken, ventasController.deleteVenta);

module.exports = router;
