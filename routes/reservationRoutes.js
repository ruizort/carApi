const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');

// POST /reservations - Crear nueva reserva
router.post('/', reservationController.createReservation);

// GET /reservations/availability - Verificar disponibilidad
router.get('/availability', reservationController.checkAvailability);

// GET /reservations/user/:userId - Obtener reservas de un usuario
router.get('/user/:userId', reservationController.getUserReservations);

// GET /reservations/:id - Obtener una reserva por ID
router.get('/:id', reservationController.getReservationById);

// PUT /reservations/:id - Actualizar reserva
router.put('/:id', reservationController.updateReservation);

// DELETE /reservations/:id - Cancelar reserva
router.delete('/:id', reservationController.cancelReservation);

module.exports = router;