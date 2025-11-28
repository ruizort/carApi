import express from "express";
import ReservationController from "../controllers/ReservationController.js";

const router = express.Router();
const reservationController = new ReservationController();
// Rutas específicas primero
router.post("/", reservationController.createReservation);
router.get("/availability", reservationController.checkAvailability);
router.get("/user/:userId", reservationController.getUserReservations);

// NUEVAS RUTAS - deben ir ANTES de las rutas con parámetros
router.get("/all", reservationController.getAllReservations);
router.get("/active", reservationController.getActiveReservations);

// ✅ RUTA MOVIDA AL CONTROLLER
router.get("/car/:carId/blocked-dates", reservationController.getBlockedDates);

// Rutas con parámetros dinámicos
router.get("/:id", reservationController.getReservationById);
router.put("/:id", reservationController.updateReservation);
router.delete("/:id", reservationController.cancelReservation);

// NUEVA RUTA: Liberar reserva activa por carId
router.delete(
  "/car/:carId/active",
  reservationController.cancelActiveReservationByCar
);

export default router;
