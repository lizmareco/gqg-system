const express = require('express');
const router = express.Router();
const pool = require('../db');

// Recepcionar factura de proveedor
router.post('/', async (req, res) => {
  try {
    const {
      proveedor_id, total, tipo,
      cuotas, modalidad, dias_cuotas, talonario_id
    } = req.body;

    // Talonario
    const talonario = await pool.query('SELECT * FROM talonarios WHERE id=$1', [talonario_id]);
    if (talonario.rowCount === 0) return res.status(400).json({ error: 'Talonario no existe' });

    const actual = talonario.rows[0].actual;
    const nro_factura = `${talonario.rows[0].serie_a}-${talonario.rows[0].serie_b}-${String(actual).padStart(7, '0')}`;

    // Insertar factura
    const result = await pool.query(
      `INSERT INTO facturas_compras (
          nro_factura, proveedor_id, fecha, total, tipo,
          cuotas, modalidad, dias_cuotas, talonario_id
       ) VALUES ($1,$2,NOW(),$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [nro_factura, proveedor_id, total, tipo, cuotas, modalidad, dias_cuotas, talonario_id]
    );

    // Actualizar numerador de talonario
    await pool.query('UPDATE talonarios SET actual=actual+1 WHERE id=$1', [talonario_id]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear la factura de compra' });
  }
});

// Buscar proveedor por RUC
router.get('/buscar-proveedor/:ruc', async (req, res) => {
  const { ruc } = req.params;
  const result = await pool.query('SELECT * FROM proveedores WHERE ruc = $1', [ruc]);
  if (result.rowCount === 0) return res.status(404).json({ error: 'Proveedor no encontrado' });
  res.json(result.rows[0]);
});

module.exports = router;
