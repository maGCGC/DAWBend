const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticateToken = require('../middlewares/authenticateToken');

router.get('/total-sales', authenticateToken, reportController.getTotalSales);
router.get('/total-purchases', authenticateToken, reportController.getTotalPurchases);
router.get('/overall-balance', authenticateToken, reportController.getOverallBalance);

module.exports = router;
