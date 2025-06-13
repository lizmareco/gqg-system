const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET cuentas a pagar por RUC de proveedor
router.get('/por-ruc/:ruc', async (req, res) => {
  const { ruc } = req.params;
  // Buscar proveedor
  const proveedor = await pool.query('SELECT * FROM proveedores WHERE ruc = $1', [ruc]);
  if (proveedor.rowCount === 0) return res.status(404).json({ error: 'Proveedor no encontrado' });

  // Traer facturas de compras de ese proveedor
  const facturas = await pool.query(
    'SELECT * FROM facturas_compras WHERE proveedor_id = $1 ORDER BY fecha DESC',
    [proveedor.rows[0].id]
  );

  // Para cada factura, traer las CUOTAS A PAGAR
  const data = [];
  for (let fac of facturas.rows) {
    const cuotas = await pool.query(
      'SELECT * FROM cuentas_pagar WHERE factura_id = $1 ORDER BY nro_cuota ASC',
      [fac.id]
    );
    data.push({
      factura: fac,
      cuotas: cuotas.rows,
    });
  }

  res.json({
    proveedor: proveedor.rows[0],
    facturas: data,
  });
});

module.exports = router;
