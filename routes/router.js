const express = require('express');
const router = express.Router();
const carRoutes = require('./carRoutes'); 
const userRoutes = require('./userRoutes');
const reservationRoutes = require('./reservationRoutes'); 

// ----------------------------------------------------
// MONTAJE DE RUTAS POR RECURSO
// ----------------------------------------------------

router.get('/', (req, res) => {
    res.status(200).json({ message: "API de Autos OK." });
});

// Autos
router.use('/cars', carRoutes);

// Usuarios
router.use('/users', userRoutes);

// Reservas
router.use('/reservations', reservationRoutes);

module.exports = router;