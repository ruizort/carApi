const express = require('express');
const router = express.Router();

const carController = require('../controllers/carController'); 


router.route('/')
    .get(carController.findAllCars) 
    .post(carController.createCar);   


router.route('/:id')
    .get(carController.findCarById)
    .put(carController.updateCar)
    .delete(carController.deleteCar); 

module.exports = router;