const db = require('../database/connection');

const gastosController = {
    
    getGastosPorCliente: async (req, res) => {
        try {
            console.log('getGastosPorCliente llamado');
            console.log('Usuario ID:', req.user.id); 
            const query = `
                SELECT Compras.cliente_id, SUM(Compras.total) as monto, Clientes.nombre as nombreCliente
                FROM Compras
                INNER JOIN Clientes ON Compras.cliente_id = Clientes.id
                WHERE Compras.usuario_id = ?
                GROUP BY Compras.cliente_id
            `;
            const [gastosPorCliente] = await db.promise().query(query, [req.user.id]);
            console.log('Gastos por cliente:', gastosPorCliente);
            res.json(gastosPorCliente);
        } catch (error) {
            console.error('Error al obtener los gastos por cliente:', error);
            res.status(500).json({ error: 'Error al obtener los gastos por cliente' });
        }
    },


    getComparativaIngresosGastos: async (req, res) => {
        try {
            console.log('getComparativaIngresosGastos llamado');
            const queryIngresos = `SELECT SUM(total) as totalIngresos FROM Ventas WHERE usuario_id = ?`;
            const queryGastos = `SELECT SUM(total) as totalGastos FROM Compras WHERE usuario_id = ?`;

            const [ingresos] = await db.promise().query(queryIngresos, [req.user.id]);
            const [gastos] = await db.promise().query(queryGastos, [req.user.id]);

            console.log('Comparativa ingresos y gastos:', {
                ingresos: ingresos[0].totalIngresos || 0,
                gastos: gastos[0].totalGastos || 0
            });

            res.json({
                ingresos: ingresos[0].totalIngresos || 0,
                gastos: gastos[0].totalGastos || 0
            });
        } catch (error) {
            console.error('Error al obtener la comparativa de ingresos y gastos:', error);
            res.status(500).json({ error: 'Error al obtener la comparativa de ingresos y gastos' });
        }
    },
};

module.exports = gastosController;
