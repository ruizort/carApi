// index.js (Punto de Entrada y Configuración Final)
require('dotenv').config();
const express = require('express');

// ✨ Importamos el Router Maestro (routes/router.js)
const masterRouter = require('./routes/router'); 
// Importamos la lógica de conexión a DB
const { connectAndSyncDB } = require('./config/db/connection'); 

const app = express();
const PORT = process.env.PORT || 3001;

// ----------------------------------------------------
// 1. MIDDLEWARES GLOBALES (Configuración de la app)
// ----------------------------------------------------

app.use(express.json()); // Middleware para leer bodies en JSON

// ⚠️ CORS: Permite la comunicación entre tu Frontend (3000) y tu Backend (3001)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:3000'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Manejar la solicitud OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// ----------------------------------------------------
// 2. MONTAJE DEL ROUTER MAESTRO
// ----------------------------------------------------

// Montar TODAS las rutas definidas en routes/router.js en la raíz de la API (/)
app.use('/', masterRouter); 

// ----------------------------------------------------
// 3. ARRANQUE DEL SERVIDOR Y CONEXIÓN A DB
// ----------------------------------------------------

// 1. Conectar a la base de datos
connectAndSyncDB() 
  .then(() => {
    // 2. Arrancar el servidor Express solo si la DB es exitosa
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ La API no pudo arrancar debido a un error de DB.');
    // Si falla la DB, el servidor no arranca.
  });