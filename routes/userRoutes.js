// src/routes/userRoutes.js
import { Router } from "express";
import { userController } from "../container/container.js";

const router = Router();

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
