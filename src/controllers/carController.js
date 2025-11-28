import db from "../models/index.js";
import { Op } from "sequelize";
import CarServices from "../services/carServices.js";

const Car = db.Car;
const Reservation = db.Reservation;

class CarController {
  constructor() {
    this.carServices = new CarServices();
  }

  checkCarAvailability = (carId) => this.carServices.checkCarAvailability;

  // 1. Obtener todos los autos con información de disponibilidad
  findAllCars = () => this.carServices.findAllCars;

  // // 2. Obtener un auto por ID con disponibilidad
  findCarById = () => this.carServices.findCarById;

  // 3. Crear un nuevo auto (CREATE)
  createCar = () => this.carServices.createCar;

  // 4. Actualizar un auto por ID (UPDATE)
  updateCar = () => this.carServices.updateCar;

  // 5. Eliminar un auto por ID (DELETE)
  deleteCar = () => this.carServices.deleteCar;
}

export default CarController;
