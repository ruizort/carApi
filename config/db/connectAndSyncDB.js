//config/db/connectAndSyncDB.js

// 📍 database/connection.js  <-- ¡AQUÍ SE CREA LA CONEXIÓN!
import db from "../../models/index.js";

/**
 * Función que autentica la conexión a la base de datos y sincroniza los modelos.
 */

async function connectAndSyncDB() {
  try {
    // 1. Probar la conexión
    await db.sequelize.authenticate();
    console.log("✅ Conexión a la base de datos exitosa.");

    // 2. Sincronizar modelos (crea/modifica tablas si es necesario)
    await db.sequelize.sync({ alter: true });
    console.log("✅ Tablas sincronizadas (Users, Cars, etc.).");

    // Devolvemos la instancia de Express para que se pueda arrancar
    return db.sequelize;
  } catch (err) {
    console.error(
      "❌ Error al conectar o sincronizar la base de datos:",
      err.message
    );
    // Relanzamos el error para que el archivo de arranque (index.js o app.js) lo capture
    throw err;
  }
}

export default connectAndSyncDB;
