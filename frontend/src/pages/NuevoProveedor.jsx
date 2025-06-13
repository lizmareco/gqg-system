import React, { useState } from "react";

export default function NuevoProveedor() {
  const [proveedor, setProveedor] = useState({
    nombre: "",
    ruc: "",
    direccion: "",
    telefono: "",
  });
  const [mensaje, setMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState("info"); // info, success, error

  const handleChange = (e) => {
    setProveedor({ ...proveedor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);

    const resp = await fetch("http://localhost:4000/api/proveedores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(proveedor),
    });

    if (resp.status === 400) {
      const data = await resp.json();
      setTipoMensaje("error");
      setMensaje(data.error);
    } else if (resp.ok) {
      setTipoMensaje("success");
      setMensaje("Proveedor registrado con éxito!");
      setProveedor({ nombre: "", ruc: "", direccion: "", telefono: "" });
    } else {
      setTipoMensaje("error");
      setMensaje("Ocurrió un error al registrar el proveedor");
    }
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        padding: "32px 28px",
        border: "1px solid #e0e0e0",
        borderRadius: 16,
        boxShadow: "0 2px 16px #0001",
        background: "#fafcff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 24, color: "#e49015", letterSpacing: 1.2 }}>
        Nuevo Proveedor
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: "block", color: "#444" }}>
            Nombre <span style={{ color: "#e53e3e" }}>*</span>
          </label>
          <input
            name="nombre"
            value={proveedor.nombre}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: "block", color: "#444" }}>
            RUC <span style={{ color: "#e53e3e" }}>*</span>
          </label>
          <input
            name="ruc"
            value={proveedor.ruc}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: "block", color: "#444" }}>
            Dirección
          </label>
          <input
            name="direccion"
            value={proveedor.direccion}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: "block", color: "#444" }}>
            Teléfono
          </label>
          <input
            name="telefono"
            value={proveedor.telefono}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: 18,
            fontWeight: 500,
            background: "#e49015",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            transition: "background 0.18s",
          }}
        >
          Registrar Proveedor
        </button>
      </form>

      {mensaje && (
        <div
          style={{
            marginTop: 22,
            color: tipoMensaje === "error" ? "#b70000" : "#035c18",
            background: tipoMensaje === "error" ? "#ffeaea" : "#e6ffed",
            padding: 14,
            borderRadius: 7,
            border: tipoMensaje === "error" ? "1px solid #efb1b1" : "1px solid #b0f5c1",
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
