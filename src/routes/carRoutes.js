import express from "express";
import * as carController from "../controllers/carController.js";

const router = express.Router();

router.route("/").get(carController.findAllCars).post(carController.createCar);

router
  .route("/:id")
  .get(carController.findCarById)
  .put(carController.updateCar)
  .delete(carController.deleteCar);

export default router;
