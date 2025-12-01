import express from "express";
import CarController from "../controllers/carController.js";

const router = express.Router();
const carController = new CarController();

router.route("/").get(carController.findAllCars).post(carController.createCar);

router
  .route("/:id")
  .get(carController.findCarById)
  .put(carController.updateCar)
  .delete(carController.deleteCar);

export default router;
