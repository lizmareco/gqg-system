// backend/routes/pagos.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Registrar pago de cuota
router.post('/cliente', async (req, res) => {
  const { cuenta_id, fecha_pago, monto } = req.body;

  // Insertar pago
  await pool.query(
    `INSERT INTO pagos_clientes (cuenta_id, fecha_pago, monto) VALUES ($1, $2, $3)`,
    [cuenta_id, fecha_pago, monto]
  );
  // Actualizar cobrado
  await pool.query(
    `UPDATE cuentas_cobrar SET cobrado = cobrado + $1 WHERE id = $2`,
    [monto, cuenta_id]
  );
  res.json({ mensaje: 'Pago registrado' });
});

module.exports = router;
