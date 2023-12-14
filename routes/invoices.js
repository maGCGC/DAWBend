const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/', authenticateToken, invoiceController.getAllInvoices);
router.get('/:id', authenticateToken, invoiceController.getInvoiceById);
router.post('/', authenticateToken, invoiceController.createInvoice);
router.put('/:id', authenticateToken, invoiceController.updateInvoice);
router.delete('/:id', authenticateToken, invoiceController.deleteInvoice);

module.exports = router;
