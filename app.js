import express from "express";
// ✨ Importamos el Router Maestro (routes/router.js)
import masterRouter from "./routes/router.js";
// Importamos la lógica de conexión a DB
import connectAndSyncDB from "./config/db/connection.js";
import dotenv from "dotenv";
dotenv.config();

// -------------------
const app = express();
const PORT = process.env.PORT || 3001;

// ----------------------------------------------------
// 1. MIDDLEWARES GLOBALES (Configuración de la app)
// ----------------------------------------------------

app.use(express.json()); // Middleware para leer bodies en JSON

// ⚠️ CORS: Permite la comunicación entre tu Frontend (3000) y tu Backend (3001)
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.CORS_ORIGIN || "http://localhost:3000"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Manejar la solicitud OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// ----------------------------------------------------
// 2. MONTAJE DEL ROUTER MAESTRO
// ----------------------------------------------------

// Montar TODAS las rutas definidas en routes/router.js en la raíz de la API (/)
app.use("/", masterRouter);

export default app;
