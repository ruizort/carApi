// server.js
require('dotenv').config();
const express = require('express');
const db = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares Globales
app.use(express.json()); // Habilita el análisis de cuerpos JSON en las solicitudes

// ⚠️ CORS: Permite la comunicación entre tu Frontend (3000) y tu Backend (3001)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Manejar la solicitud OPTIONS (necesario para CORS pre-flight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// ----------------------------------------------------
// RUTAS DE LA API (faltan todavia)
// Ejemplo de ruta de prueba:
app.get('/', (req, res) => {
    res.status(200).json({ message: "API de Autos OK." });
});
// ----------------------------------------------------

// Inicializar DB y Arrancar Servidor

//instalar xamp o algun otro y crear una base de datos con el nombre CarApi
db.sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos exitosa.');
    return db.sequelize.sync({ alter: true }); // Sincroniza los modelos
  })
  .then(() => {
    console.log('✅ Tablas sincronizadas (Users, Cars, etc.).');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error fatal al iniciar la API:', err.message);
  });