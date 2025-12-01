
//config/db/connection.js

// 📍 database/connection.js  <-- ¡AQUÍ SE CREA LA CONEXIÓN!
import { Sequelize } from "sequelize";
import process from "process";
import configJson from "../config.json" with { type: "json" };

// ... lógica para determinar el entorno (env) ...

const env = process.env.NODE_ENV || "development";
const config = configJson[env];

let sequelize; // La instancia se crea aquí 👇

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

export default sequelize;