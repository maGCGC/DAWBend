// En backend/controllers/invoiceController.js
const db = require('../database/connection');

const invoiceController = {
    getAllInvoices: (req, res) => {
        const query = 'SELECT * FROM Facturas';
        db.query(query, (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            res.status(200).json(results);
        });
    },
    getInvoiceById: (req, res) => {
        const query = 'SELECT * FROM Facturas WHERE id = ?';
        db.query(query, [req.params.id], (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            if (results.length > 0) {
                res.status(200).json(results[0]);
            } else {
                res.status(404).send('Factura no encontrada');
            }
        });
    },
    createInvoice: (req, res) => {
        const { numero_factura, fecha, total, cliente_id, usuario_id } = req.body;
        const query = 'INSERT INTO Facturas (numero_factura, fecha, total, cliente_id, usuario_id) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [numero_factura, fecha, total, cliente_id, usuario_id], (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            res.status(201).send(`Factura creada con ID: ${results.insertId}`);
        });
    },
    updateInvoice: (req, res) => {
        const { numero_factura, fecha, total, cliente_id, usuario_id } = req.body;
        const query = 'UPDATE Facturas SET numero_factura = ?, fecha = ?, total = ?, cliente_id = ?, usuario_id = ? WHERE id = ?';
        db.query(query, [numero_factura, fecha, total, cliente_id, usuario_id, req.params.id], (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            if (results.affectedRows > 0) {
                res.status(200).send(`Factura actualizada con ID: ${req.params.id}`);
            } else {
                res.status(404).send('Factura no encontrada');
            }
        });
    },
    deleteInvoice: (req, res) => {
        const query = 'DELETE FROM Facturas WHERE id = ?';
        db.query(query, [req.params.id], (error, results) => {
            if (error) {
                return res.status(500).json({ error });
            }
            if (results.affectedRows > 0) {
                res.status(200).send(`Factura eliminada con ID: ${req.params.id}`);
            } else {
                res.status(404).send('Factura no encontrada');
            }
        });
    }
};

module.exports = invoiceController;
