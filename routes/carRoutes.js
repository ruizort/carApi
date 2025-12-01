import { Router } from "express";
import { carController } from "../container/container.js";

const router = Router();

router.route("/").get(carController.findAllCars).post(carController.createCar);

router
  .route("/:id")
  .get(carController.findCarById)
  .put(carController.updateCar)
  .delete(carController.deleteCar);

export default router;
