import express from "express";
import carRoutes from "./carRoutes.js";
import userRoutes from "./userRoutes.js";
import reservationRoutes from "./reservationRoutes.js";

const router = express.Router();

// ----------------------------------------------------
// MONTAJE DE RUTAS POR RECURSO
// ----------------------------------------------------

router.get("/", (req, res) => {
  res.status(200).json({ message: "API de Autos OK." });
});

// Autos
router.use("/cars", carRoutes);

// Usuarios
router.use("/users", userRoutes);

// Reservas
router.use("/reservations", reservationRoutes);

export default router;
