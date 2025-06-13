import React, { useState } from "react";

export default function VerCuentasPagar() {
  const [ruc, setRuc] = useState("");
  const [info, setInfo] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [expandir, setExpandir] = useState({});

  const handleBuscar = async (e) => {
    e.preventDefault();
    setInfo(null);
    setMensaje(null);
    setExpandir({});
    if (!ruc) return;

    const resp = await fetch(`http://localhost:4000/api/cuentas_pagar/por-ruc/${ruc}`);
    if (resp.ok) {
      const data = await resp.json();
      setInfo(data);
      if (data.facturas.length === 0) setMensaje("El proveedor no tiene cuentas a pagar.");
    } else {
      setMensaje("No se encontró proveedor con ese RUC.");
    }
  };

  return (
    <div style={{
      maxWidth: 700,
      margin: "40px auto",
      background: "#fffaf5",
      padding: 30,
      borderRadius: 12,
      boxShadow: "0 2px 12px #0001"
    }}>
      <h2 style={{ color: "#e49015" }}>Ver cuentas a pagar</h2>
      <form onSubmit={handleBuscar} style={{ marginBottom: 28 }}>
        <label>RUC del proveedor: </label>
        <input
          value={ruc}
          onChange={e => setRuc(e.target.value)}
          style={{ marginLeft: 8, padding: 8, borderRadius: 5, border: "1px solid #bbb", minWidth: 150 }}
          required
        />
        <button
          type="submit"
          style={{
            marginLeft: 16, padding: "8px 20px", borderRadius: 6, background: "#e49015",
            color: "#fff", border: "none", fontWeight: 500, cursor: "pointer"
          }}
        >
          Buscar
        </button>
      </form>
      {mensaje && <div style={{ color: "#b70000", marginBottom: 14 }}>{mensaje}</div>}
      {info && info.proveedor && (
        <div style={{
          background: "#fff3e6", borderRadius: 7, padding: 14, marginBottom: 26,
          border: "1px solid #f6d8b0"
        }}>
          <strong>Proveedor:</strong> {info.proveedor.nombre}<br />
          <strong>RUC:</strong> {info.proveedor.ruc}<br />
          <strong>Dirección:</strong> {info.proveedor.direccion || "-"}<br />
          <strong>Teléfono:</strong> {info.proveedor.telefono || "-"}
        </div>
      )}
      {info && info.facturas && info.facturas.map((facData, idx) => (
        <div
          key={facData.factura.id}
          style={{
            background: "#fff",
            borderRadius: 7,
            marginBottom: 16,
            boxShadow: "0 1px 5px #bbb2",
            padding: "8px 14px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => setExpandir(e => ({ ...e, [idx]: !e[idx] }))}>
            <span style={{
              fontWeight: "bold", fontSize: 18, color: "#e49015", flex: 1
            }}>
              Factura {facData.factura.nro_factura} | Fecha: {new Date(facData.factura.fecha).toLocaleDateString()}
              <br />
              <span style={{ fontSize: 15, color: "#444", fontWeight: "normal" }}>
                Tipo:&nbsp;
                {facData.factura.tipo === "contado"
                  ? "Contado"
                  : facData.factura.tipo === "credito_regular"
                    ? "Crédito Regular"
                    : facData.factura.tipo === "credito_irregular"
                      ? <>
                        Crédito Irregular
                        {Array.isArray(facData.factura.dias_cuotas) && facData.factura.dias_cuotas.length > 0 && (
                          <span style={{ color: "#b86200", marginLeft: 8 }}>
                            (
                            {facData.factura.dias_cuotas.join(", ")} días
                            )
                          </span>
                        )}
                      </>
                      : facData.factura.tipo
                }
              </span>
            </span>
            <button
              style={{
                marginLeft: 12, background: "#fffaf5", border: "1px solid #f9e3ce",
                borderRadius: 7, cursor: "pointer", padding: "3px 14px"
              }}
              onClick={e => { e.stopPropagation(); setExpandir(ex => ({ ...ex, [idx]: !ex[idx] })); }}>
              {expandir[idx] ? "Ocultar" : "Ver cuotas"}
            </button>
          </div>
          {expandir[idx] && (
            <table style={{ marginTop: 10, width: "98%", background: "#fffaf5", borderRadius: 7 }}>
              <thead>
                <tr style={{ background: "#fff3e6" }}>
                  <th style={{ padding: 6 }}>Cuota</th>
                  <th>Importe</th>
                  <th>Vence</th>
                  <th>Pagado</th>
                </tr>
              </thead>
              <tbody>
                {facData.cuotas.map((cuota, i) => (
                  <tr key={i} style={{ textAlign: "center", background: "#fff" }}>
                    <td>{cuota.nro_cuota}</td>
                    <td>{Number(cuota.importe).toLocaleString('de-DE', { minimumFractionDigits: 0 })}</td>
                    <td>{cuota.vence ? new Date(cuota.vence).toLocaleDateString() : "-"}</td>
                    <td>{Number(cuota.pagado).toLocaleString('de-DE', { minimumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
