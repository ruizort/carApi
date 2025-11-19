const express = require('express');
const router = express.Router();
const carRoutes = require('./carRoutes'); 
const userRoutes = require('./userRoutes');

// ----------------------------------------------------
// MONTAJE DE RUTAS POR RECURSO
// ----------------------------------------------------


router.get('/', (req, res) => {
    res.status(200).json({ message: "API de Autos OK." });
});

// Autitos
router.use('/cars', carRoutes);

// Usuarios
router.use('/users', userRoutes);

module.exports = router;