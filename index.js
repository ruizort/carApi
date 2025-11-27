import app from "./src/app.js";
import connectAndSyncDB from "./src/config/db/connection.js";

const PORT = process.env.PORT || 3000;

// 1. Conectar a la base de datos
connectAndSyncDB()
  .then(() => {
    // 2. Arrancar el servidor Express solo si la DB es exitosa
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ La API no pudo arrancar debido a un error de DB.");
    // Si falla la DB, el servidor no arranca.
  });
