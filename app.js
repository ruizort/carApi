// src/app.js
require('dotenv').config();
const express = require('express');

// Importar rutas de catálogo
const carRoutes = require('./routes/carRoutes'); 

const app = express();

// Middlewares Globales
app.use(express.json()); // Habilita el análisis de cuerpos JSON

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
// MONTAJE DE RUTAS
// ----------------------------------------------------

// Ruta de prueba:
app.get('/', (req, res) => {
    res.status(200).json({ message: "API de Autos OK." });
});

// Montar las rutas CRUD del catálogo
app.use('/cars', carRoutes); 

// Exportamos la aplicación
module.exports = app;