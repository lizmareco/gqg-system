const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todas las ventas
router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM facturas_compras');
  res.json(rows);
});

// Registrar nueva factura, el trigger va a cargar las cuentas a cobrar
router.post('/', async (req, res) => {
  const {
    proveedor_id, fecha, total, tipo,
    cuotas, modalidad, dias_cuotas, talonario_id
  } = req.body;

  // Numerar la factura automáticamente
  const talonario = await pool.query('SELECT * FROM talonarios WHERE id=$1', [talonario_id]);
  if (talonario.rowCount === 0) return res.status(400).json({ error: 'Talonario no existe' });

  const actual = talonario.rows[0].actual;
  const nro_factura = `${talonario.rows[0].serie_a}-${talonario.rows[0].serie_b}-${String(actual).padStart(7, '0')}`;

  // Insertar factura
  const result = await pool.query(
    `INSERT INTO facturas_compras (
        nro_factura, proveedor_id, fecha, total, tipo,
        cuotas, modalidad, dias_cuotas, talonario_id
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING *`,
    [nro_factura, proveedor_id, fecha, total, tipo, cuotas, modalidad, dias_cuotas, talonario_id]
  );

  // Actualizar numerador de talonario
  await pool.query('UPDATE talonarios SET actual=actual+1 WHERE id=$1', [talonario_id]);

  res.json(result.rows[0]);
});

module.exports = router;
