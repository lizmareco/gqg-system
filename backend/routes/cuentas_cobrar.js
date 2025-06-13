const express = require('express');
const router = express.Router();
const pool = require('../db');

// get de clientes, facturas y cuotas
router.get('/por-ruc/:ruc', async (req, res) => {
  const { ruc } = req.params;
  // Buscar cliente
  const cliente = await pool.query('SELECT * FROM clientes WHERE ruc = $1', [ruc]);
  if (cliente.rowCount === 0) return res.status(404).json({ error: 'Cliente no encontrado' });

  // Traer facturas de ventas de ese cliente
  const facturas = await pool.query(
    'SELECT * FROM facturas_ventas WHERE cliente_id = $1 ORDER BY fecha DESC',
    [cliente.rows[0].id]
  );

  // Para cada factura, traer las cuotas
  const data = [];
  for (let fac of facturas.rows) {
    const cuotas = await pool.query(
      'SELECT * FROM cuentas_cobrar WHERE factura_id = $1 ORDER BY nro_cuota ASC',
      [fac.id]
    );
    data.push({
      factura: fac,
      cuotas: cuotas.rows,
    });
  }

  res.json({
    cliente: cliente.rows[0],
    facturas: data,
  });
});

module.exports = router;
