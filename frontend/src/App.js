import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NuevoCliente from "./pages/NuevoCliente";
import GenerarFactura from "./pages/GenerarFactura";
import VerCuentasCobrar from './pages/VerCuentasCobrar';
import NuevoProveedor from './pages/NuevoProveedor';
import RecepcionarFacturaProveedor from './pages/RecepcionarFacturaProveedor';
import VerCuentasPagar from './pages/VerCuentasPagar';


function App() {
  return (
    <Router>
      <div style={{ fontFamily: "sans-serif", minHeight: "100vh", background: "#f6fafd" }}>
        <h1 style={{ textAlign: "center", margin: "40px 0 24px 0", color: "#0c466f", letterSpacing: 2 }}>
          GQG SYSTEM
        </h1>
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          marginTop: "40px"
        }}>
          {/* Clientes */}
          <div style={{
            background: "#e4f2fa",
            borderRadius: 14,
            padding: 32,
            minWidth: 260,
            boxShadow: "0 2px 8px #9bd0ed88"
          }}>
            <h2 style={{ color: "#1578b8", marginBottom: 24 }}>Clientes</h2>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "1.1em" }}>
              <li>
                <Link to="/clientes/nuevo">
                  <button style={btnStyle}>Crear Cliente</button>
                </Link>
              </li>
              <li>
                <Link to="/facturas/nueva">
                <button style={btnStyle}>Generar Factura</button>
                </Link>
              </li>
              <li>
                <Link to="/clientes/cuentas-cobrar">
                  <button style={btnStyle}>Ver Cuentas a Cobrar</button>
                </Link>
              </li>
            </ul>
          </div>
          {/* Proveedores */}
          <div style={{
            background: "#fff6eb",
            borderRadius: 14,
            padding: 32,
            minWidth: 260,
            boxShadow: "0 2px 8px #ffe1c088"
          }}>
            <h2 style={{ color: "#e49015", marginBottom: 24 }}>Proveedores</h2>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "1.1em" }}>
              <li>
                <Link to="/proveedores/nuevo">
                  <button style={btnStyle}>Crear Proveedor</button>
                </Link>
              </li>
              <li>
                <Link to="/proveedores/recepcionar-factura">
                  <button style={btnStyle}>Recepcionar Factura</button>
                </Link>
              </li>
              <li>
                <Link to="/proveedores/cuentas-pagar">
                  <button style={btnStyle}>Ver Cuentas a Pagar</button>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Páginas */}
        <Routes>
          <Route path="/clientes/nuevo" element={<NuevoCliente />} />
          <Route path="/facturas/nueva" element={<GenerarFactura />} />
          <Route path="/clientes/cuentas-cobrar" element={<VerCuentasCobrar />} />
          <Route path="/proveedores/nuevo" element={<NuevoProveedor />} />
          <Route path="/proveedores/recepcionar-factura" element={<RecepcionarFacturaProveedor />} />
          <Route path="/proveedores/cuentas-pagar" element={<VerCuentasPagar />} />
        </Routes>
      </div>
    </Router>
  );
}

const btnStyle = {
  width: "100%",
  padding: "12px 0",
  margin: "10px 0",
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "1em",
  fontWeight: "bold",
  letterSpacing: 1,
  transition: "background 0.2s, border 0.2s",
  boxShadow: "0 1px 4px #0001"
};

export default App;
