const db = require('../database/connection');

const comprasController = {
  getAllCompras: async (req, res) => {
    try {
      const [compras] = await db.promise().query('SELECT * FROM Compras WHERE usuario_id = ?', [req.user.id]);
      res.json(compras);
    } catch (error) {
      console.error('Error al obtener las Compras:', error);
      res.status(500).json({ error: 'Error al obtener las compras' });
    }
  },

  getCompraById: async (req, res) => {
    try {
      const [compra] = await db.promise().query('SELECT * FROM Compras WHERE id = ?', [req.params.id]);
      if (compra.length === 0) {
        return res.status(404).json({ error: 'Compra no encontrada' });
      }
      res.json(compra[0]);
    } catch (error) {
      console.error('Error al obtener la compra:', error);
      res.status(500).json({ error: 'Error al obtener la compra' });
    }
  },

  createCompra: async (req, res) => {
    const { numero_factura, fecha, total, concepto, cliente_id } = req.body;
    try {
      const [result] = await db.promise().query(
        'INSERT INTO Compras (numero_factura, fecha, total, concepto, cliente_id, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
        [numero_factura, fecha, total, concepto, cliente_id, req.user.id]
      );

      const [newCompra] = await db.promise().query('SELECT * FROM Compras WHERE id = ?', [result.insertId]);
      res.status(201).json(newCompra[0]);
    } catch (error) {
      console.error('Error al crear la Compra:', error);
      res.status(500).json({ error: 'Error al crear la Compra' });
    }
  },

  updateCompra: async (req, res) => {
    const { numero_factura, fecha, total, concepto, cliente_id } = req.body;
    try {
      const [result] = await db.promise().query(
        'UPDATE Compras SET numero_factura = ?, fecha = ?, total = ?, concepto = ?, cliente_id = ? WHERE id = ? AND usuario_id = ?',
        [numero_factura, fecha, total, concepto, cliente_id, req.params.id, req.user.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Compra no encontrada o usuario no autorizado' });
      }

      const [updatedCompra] = await db.promise().query('SELECT * FROM Compras WHERE id = ?', [req.params.id]);
      res.json(updatedCompra[0]);
    } catch (error) {
      console.error('Error al actualizar la Compra:', error);
      res.status(500).json({ error: 'Error al actualizar la Compra' });
    }
  },

  deleteCompra: async (req, res) => {
    try {
      const [result] = await db.promise().query(
        'DELETE FROM Compras WHERE id = ? AND usuario_id = ?', [req.params.id, req.user.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Compra no encontrada o usuario no autorizado' });
      }

      res.status(200).json({ message: 'Compra eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar la Compra:', error);
      res.status(500).json({ error: 'Error al eliminar la Compra' });
    }
  },
};

module.exports = comprasController;
