const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/comprasController');
const authenticateToken = require('../middlewares/authenticateToken'); // Asegúrate de tener este middleware

// Obtener todas las compras
router.get('/', authenticateToken, comprasController.getAllCompras);

// Obtener una Compra por ID
router.get('/:id', authenticateToken, comprasController.getCompraById);

// Crear una nueva Compra
router.post('/', authenticateToken, comprasController.createCompra);

// Actualizar una Compra
router.put('/:id', authenticateToken, comprasController.updateCompra);

// Eliminar una Compra
router.delete('/:id', authenticateToken, comprasController.deleteCompra);

module.exports = router;
