const express = require('express');
const router = express.Router();

const carController = require('../controllers/carController'); 

// Rutas para el Catálogo de Autos (/cars)

// 1. Rutas que no requieren ID (GET y POST a /cars)
router.route('/')
    .get(carController.findAllCars) // GET /cars
    .post(carController.createCar);   // POST /cars

// 2. Rutas que requieren ID (GET, PUT y DELETE a /cars/:id)
router.route('/:id')
    .get(carController.findCarById)    // GET /cars/:id
    .put(carController.updateCar)      // PUT /cars/:id
    .delete(carController.deleteCar);  // DELETE /cars/:id

module.exports = router;