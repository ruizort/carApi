// src/routes/userRoutes.js

import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// 1. Ruta POST para REGISTRAR un nuevo usuario.
//    (Ruta final será: POST /users)
router.post("/", userController.register); // ✨ Registro en la ruta raíz del recurso

// 2. Ruta POST para iniciar sesión.
//    (Ruta final será: POST /users/login)
router.post("/login", userController.login);

// 3. Ruta GET para obtener todos los usuarios (si la necesitas).
//    (Ruta final será: GET /users)
// Asumimos que tienes una función getAllUsers en tu controlador:
router.get("/", userController.getAllUsers);

export default router;
