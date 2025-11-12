require('dotenv').config();
const app = require('./app'); // Importa la aplicación Express configurada
const { connectAndSyncDB } = require('./config/db/connection'); // Importa la función de conexión

const PORT = process.env.PORT || 3001;

// 1. Conectar a la base de datos
connectAndSyncDB()
  .then(() => {
    // 2. Arrancar el servidor Express solo si la DB es exitosa
    app.listen(PORT, () => {
      console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ La API no pudo arrancar debido a un error de DB.');
    // No arrancamos app.listen si la conexión falló.
  });