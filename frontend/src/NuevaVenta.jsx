// frontend/src/pages/NuevaVenta.jsx
import React, { useState } from 'react';

export default function NuevaVenta() {
  const [data, setData] = useState({
    cliente_id: '',
    fecha: '',
    total: '',
    tipo: 'contado',
    cuotas: 1,
    modalidad: '',
    dias_cuotas: [],
    talonario_id: 1
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Para cuotas irregulares
  const handleDiasChange = (e) => {
    setData({ ...data, dias_cuotas: e.target.value.split(',').map(Number) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:4000/api/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    alert('Factura creada');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="cliente_id" placeholder="Cliente ID" onChange={handleChange} />
      <input name="fecha" placeholder="Fecha (YYYY-MM-DD)" onChange={handleChange} />
      <input name="total" placeholder="Total" onChange={handleChange} />
      <select name="tipo" onChange={handleChange}>
        <option value="contado">Contado</option>
        <option value="credito_regular">Crédito Regular</option>
        <option value="credito_irregular">Crédito Irregular</option>
      </select>
      <input name="cuotas" placeholder="Cantidad de cuotas" type="number" onChange={handleChange} />
      <select name="modalidad" onChange={handleChange}>
        <option value="">N/A</option>
        <option value="REGULAR">Regular</option>
        <option value="IRREGULAR">Irregular</option>
      </select>
      <input
        name="dias_cuotas"
        placeholder="Días de cada cuota (ej: 20,45,60)"
        onChange={handleDiasChange}
        disabled={data.tipo !== 'credito_irregular'}
      />
      <input name="talonario_id" placeholder="Talonario ID" type="number" value={data.talonario_id} onChange={handleChange} />
      <button type="submit">Crear Venta</button>
    </form>
  );
}
