// src/db/connection.js
const db = require('../../models'); // Importa los modelos y la instancia de Sequelize

const userFixSeeder = require('../../seeders/20251119175549-fix-users-passwords-for-production');

/**
 * Función que autentica la conexión a la base de datos y sincroniza los modelos.
 */
async function connectAndSyncDB() {
  try {
    // 1. Probar la conexión
    await db.sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa.');
    
    // 2. Sincronizar modelos (crea/modifica tablas si es necesario)
    await db.sequelize.sync({ alter: true }); 
    console.log('✅ Tablas sincronizadas (Users, Cars, etc.).');
    
        await userFixSeeder.up(db.sequelize.getQueryInterface(), db.Sequelize);
      console.log('🌱 Seeder ejecutado: fix-users-passwords-for-production');

    // Devolvemos la instancia de Express para que se pueda arrancar
    return db.sequelize; 

  } catch (err) {
    console.error('❌ Error al conectar o sincronizar la base de datos:', err.message);
    // Relanzamos el error para que el archivo de arranque (index.js o app.js) lo capture
    throw err; 
  }
}

module.exports = { connectAndSyncDB };