import React, { useState } from "react";

export default function GenerarFactura() {
  const [ruc, setRuc] = useState("");
  const [cliente, setCliente] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [factura, setFactura] = useState({
    total: "",
    tipo: "contado",
    cuotas: 1,
    modalidad: "",
    dias_cuotas: "",
    talonario_id: 1,
  });

  const handleBuscarCliente = async (e) => {
    e.preventDefault();
    setCliente(null);
    setMensaje(null);
    const resp = await fetch(`http://localhost:4000/api/facturas_ventas/buscar-cliente/${ruc}`);
    if (resp.ok) {
      const data = await resp.json();
      setCliente(data);
    } else {
      setMensaje("Cliente no encontrado. Verifique el RUC.");
    }
  };

  const handleChange = (e) => {
    setFactura({ ...factura, [e.target.name]: e.target.value });
  };

  const handleTipoChange = (e) => {
    const tipo = e.target.value;
    let modalidad = "";
    if (tipo === "credito_regular") modalidad = "REGULAR";
    if (tipo === "credito_irregular") modalidad = "IRREGULAR";
    setFactura({ ...factura, tipo, modalidad });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMensaje(null);

  // Validación: total debe ser mayor a 0
  if (Number(factura.total) <= 0 || isNaN(Number(factura.total))) {
    setMensaje("El total de la factura debe ser un número mayor a cero.");
    return;
  }

  // Validación para crédito irregular:
  if (factura.tipo === "credito_irregular") {
    const dias = factura.dias_cuotas
      .split(",")
      .map(s => s.trim())
      .filter(s => s !== "");

    if (dias.length !== Number(factura.cuotas)) {
      setMensaje(
        `La cantidad de días ingresada (${dias.length}) debe coincidir con la cantidad de cuotas (${factura.cuotas})`
      );
      return;
    }
  }

  if (!cliente) {
    setMensaje("Debes buscar y seleccionar un cliente.");
    return;
  }

  const body = {
    cliente_id: cliente.id,
    total: factura.total,
    tipo: factura.tipo,
    cuotas: Number(factura.cuotas),
    modalidad: factura.modalidad || null,
    dias_cuotas:
      factura.tipo === "credito_irregular"
        ? factura.dias_cuotas.split(",").map((s) => Number(s.trim()))
        : null,
    talonario_id: Number(factura.talonario_id),
  };

  const resp = await fetch("http://localhost:4000/api/facturas_ventas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (resp.status === 201) {
    setMensaje("¡Factura generada correctamente!");
    setFactura({
      total: "",
      tipo: "contado",
      cuotas: 1,
      modalidad: "",
      dias_cuotas: "",
      talonario_id: 1,
    });
    setCliente(null);
    setRuc("");
  } else {
    const data = await resp.json();
    setMensaje(data.error || "Error al generar factura");
  }
};


  return (
    <div
      style={{
        maxWidth: 480,
        margin: "40px auto",
        padding: "30px 32px",
        border: "1px solid #e0e0e0",
        borderRadius: 16,
        boxShadow: "0 2px 16px #0001",
        background: "#f7faff",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#233" }}>Generar Factura</h2>
      {/* Buscar Cliente */}
      <form onSubmit={handleBuscarCliente} style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: 500, color: "#334" }}>
          Ingrese RUC del cliente:{" "}
        </label>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <input
            value={ruc}
            onChange={e => setRuc(e.target.value)}
            required
            placeholder="RUC"
            style={{
              flex: 1,
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #bbb",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 18px",
              borderRadius: 6,
              background: "#224199",
              color: "#fff",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            Buscar
          </button>
        </div>
      </form>
      {/* Mostrar cliente */}
      {cliente && (
        <div
          style={{
            background: "#e8f0fe",
            padding: 10,
            borderRadius: 6,
            marginBottom: 24,
            color: "#224199",
          }}
        >
          <strong>Cliente:</strong> {cliente.nombre}<br />
          <strong>RUC:</strong> {cliente.ruc}<br />
          <strong>Dirección:</strong> {cliente.direccion || "-"}<br />
          <strong>Teléfono:</strong> {cliente.telefono || "-"}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label>Total de la factura: </label>
          <input
            name="total"
            type="number"
            min="1"
            value={factura.total}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, borderRadius: 5, border: "1px solid #ccc" }}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label>Tipo de factura: </label>
          <select
            name="tipo"
            value={factura.tipo}
            onChange={handleTipoChange}
            style={{ width: "100%", padding: 8, borderRadius: 5, border: "1px solid #ccc" }}
          >
            <option value="contado">Contado</option>
            <option value="credito_regular">Crédito Regular</option>
            <option value="credito_irregular">Crédito Irregular</option>
          </select>
        </div>
        {(factura.tipo === "credito_regular" || factura.tipo === "credito_irregular") && (
          <div style={{ marginBottom: 14 }}>
            <label>Cantidad de cuotas: </label>
            <input
              name="cuotas"
              type="number"
              min="2"
              value={factura.cuotas}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: 8, borderRadius: 5, border: "1px solid #ccc" }}
            />
          </div>
        )}
        {factura.tipo === "credito_irregular" && (
          <div style={{ marginBottom: 14 }}>
            <label>Días de vencimiento de cada cuota (ej: 20,45,60): </label>
            <input
              name="dias_cuotas"
              value={factura.dias_cuotas}
              onChange={handleChange}
              required
              placeholder="Ejemplo: 20,45,60"
              style={{ width: "100%", padding: 8, borderRadius: 5, border: "1px solid #ccc" }}
            />
          </div>
        )}
        {/* Si tienes más de un talonario, puedes permitir elegir, aquí es fijo id=1 */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: 18,
            fontWeight: 500,
            background: "#224199",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            marginTop: 8,
          }}
        >
          Generar Factura
        </button>
      </form>
      {mensaje && (
        <div
          style={{
            marginTop: 18,
            color: mensaje.includes("correctamente") ? "#035c18" : "#b70000",
            background: mensaje.includes("correctamente") ? "#e6ffed" : "#ffeaea",
            padding: 12,
            borderRadius: 7,
            textAlign: "center",
            fontSize: 16,
          }}
        >
          {mensaje}
        </div>
      )}
    </div>
  );
}