const express = require('express');
const cors = require('cors');
const clientesRoutes = require('./routes/clientes');
const facturasVentasRoutes = require('./routes/facturas_ventas');
const cuentasCobrarRoutes = require('./routes/cuentas_cobrar');
const proveedoresRoutes = require('./routes/proveedores');
const facturasComprasRoutes = require('./routes/facturas_compras');
const cuentasPagarRoutes = require('./routes/cuentas_pagar');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/clientes', clientesRoutes);
app.use('/api/facturas_ventas', facturasVentasRoutes);
app.use('/api/cuentas_cobrar', cuentasCobrarRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/facturas_compras', facturasComprasRoutes);
app.use('/api/cuentas_pagar', cuentasPagarRoutes);

app.get('/', (req, res) => res.send('¡Backend funcionando!'));
app.listen(4000, () => console.log('Servidor escuchando en puerto 4000'));
