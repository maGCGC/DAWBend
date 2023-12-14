const db = require('../database/connection');

const ventasController = {
  getAllVentas: async (req, res) => {
    try {
      const [ventas] = await db.promise().query('SELECT * FROM Ventas WHERE usuario_id = ?', [req.user.id]);
      res.json(ventas);
    } catch (error) {
      console.error('Error al obtener las ventas:', error);
      res.status(500).json({ error: 'Error al obtener las ventas' });
    }
  },

  getVentaById: async (req, res) => {
    try {
      const [venta] = await db.promise().query('SELECT * FROM Ventas WHERE id = ?', [req.params.id]);
      if (venta.length === 0) {
        return res.status(404).json({ error: 'Venta no encontrada' });
      }
      res.json(venta[0]);
    } catch (error) {
      console.error('Error al obtener la venta:', error);
      res.status(500).json({ error: 'Error al obtener la venta' });
    }
  },

  createVenta: async (req, res) => {
    const { numero_factura, fecha, total, concepto, cliente_id } = req.body;
    try {
      const [result] = await db.promise().query(
        'INSERT INTO Ventas (numero_factura, fecha, total, concepto, cliente_id, usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
        [numero_factura, fecha, total, concepto, cliente_id, req.user.id]
      );

      const [newVenta] = await db.promise().query('SELECT * FROM Ventas WHERE id = ?', [result.insertId]);
      res.status(201).json(newVenta[0]);
    } catch (error) {
      console.error('Error al crear la venta:', error);
      res.status(500).json({ error: 'Error al crear la venta' });
    }
  },

  updateVenta: async (req, res) => {
    const { numero_factura, fecha, total, concepto, cliente_id } = req.body;
    try {
      const [result] = await db.promise().query(
        'UPDATE Ventas SET numero_factura = ?, fecha = ?, total = ?, concepto = ?, cliente_id = ? WHERE id = ? AND usuario_id = ?',
        [numero_factura, fecha, total, concepto, cliente_id, req.params.id, req.user.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Venta no encontrada o usuario no autorizado' });
      }

      const [updatedVenta] = await db.promise().query('SELECT * FROM Ventas WHERE id = ?', [req.params.id]);
      res.json(updatedVenta[0]);
    } catch (error) {
      console.error('Error al actualizar la venta:', error);
      res.status(500).json({ error: 'Error al actualizar la venta' });
    }
  },
  deleteVenta: async (req, res) => {
    try {
      const [result] = await db.promise().query(
        'DELETE FROM Ventas WHERE id = ? AND usuario_id = ?', [req.params.id, req.user.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Venta no encontrada o usuario no autorizado' });
      }

      res.status(200).json({ message: 'Venta eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar la venta:', error);
      res.status(500).json({ error: 'Error al eliminar la venta' });
    }
  },
  getVentasSummary: async (req, res) => {
    try {
      console.log('getVentasSummary llamado'); // Para confirmar que la función es llamada

      // Log del ID del usuario para asegurarse de que se está obteniendo correctamente
      console.log('Usuario ID:', req.user.id); 

      const [totales] = await db.promise().query(`
        SELECT
          SUM(CASE WHEN fecha >= CURDATE() - INTERVAL 60 DAY THEN total ELSE 0 END) AS totalUltimos60Dias,
          SUM(CASE WHEN fecha >= CURDATE() - INTERVAL 30 DAY THEN total ELSE 0 END) AS totalUltimos30Dias
        FROM Ventas
        WHERE usuario_id = ?
      `, [req.user.id]);

      console.log('Datos obtenidos:', totales[0]); // Verificar los datos obtenidos de la base de datos
      res.json(totales[0]);
    } catch (error) {
      console.error('Error al obtener el resumen de ventas:', error);
      res.status(500).json({ error: 'Error al obtener el resumen de ventas' });
    }
  },
};

module.exports = ventasController;
