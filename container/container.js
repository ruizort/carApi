import CarController from "../controllers/CarController.js";
import CarService from "../services/CarService.js";

import ReservationController from "../controllers/ReservationController.js";
import ReservationService from "../services/ReservationService.js";

import UserController from "../controllers/UserController.js";
import UserService from "../services/UserService.js";

const carService = new CarService();
const carController = new CarController(carService);

const reservationService = new ReservationService();
const reservationController = new ReservationController(reservationService);

const userService = new UserService();
const userController = new UserController(userService);

export { carController, userController, reservationController };
