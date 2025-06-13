const express = require('express');
const router = express.Router();
const pool = require('../db');

// Endpoint para crear cliente
router.post('/', async (req, res) => {
  try {
    const { nombre, ruc, direccion, telefono } = req.body;

    // Validación
    const existe = await pool.query('SELECT 1 FROM clientes WHERE ruc = $1', [ruc]);
    if (existe.rowCount > 0) {
      return res.status(400).json({ error: 'Ya existe un cliente con ese RUC' });
    }

    const result = await pool.query(
      'INSERT INTO clientes (nombre, ruc, direccion, telefono) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, ruc, direccion, telefono]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

// Listar clientes
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM clientes');
  res.json(result.rows);
});

module.exports = router;
