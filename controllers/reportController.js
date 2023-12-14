const db = require('../database/connection');

const reportController = {
    getTotalSales: (req, res) => {
        const query = 'SELECT SUM(total) AS totalSales FROM Facturas';
        db.query(query, (error, results) => {
            if (error) return res.status(500).json({ error });
            res.json({ totalSales: results[0].totalSales || 0 });
        });
    },

    getTotalPurchases: (req, res) => {
        // Asumiendo que "Pagos" representa las compras
        const query = 'SELECT SUM(monto) AS totalPurchases FROM Pagos';
        db.query(query, (error, results) => {
            if (error) return res.status(500).json({ error });
            res.json({ totalPurchases: results[0].totalPurchases || 0 });
        });
    },

    getOverallBalance: (req, res) => {
        // Balance entre ventas y compras
        const salesQuery = 'SELECT SUM(total) AS totalSales FROM Facturas';
        const purchasesQuery = 'SELECT SUM(monto) AS totalPurchases FROM Pagos';

        db.query(salesQuery, (error, salesResults) => {
            if (error) return res.status(500).json({ error });

            db.query(purchasesQuery, (error, purchasesResults) => {
                if (error) return res.status(500).json({ error });

                const totalSales = salesResults[0].totalSales || 0;
                const totalPurchases = purchasesResults[0].totalPurchases || 0;
                const balance = totalSales - totalPurchases;

                res.json({ totalSales, totalPurchases, balance });
            });
        });
    },

    // Aquí puedes agregar más funciones para otros tipos de informes que requieras
};

module.exports = reportController;
