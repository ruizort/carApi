"use strict";

import { fileURLToPath, pathToFileURL } from "url";
import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import process from "process";
import configJson from "../config/config.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//-----

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = configJson[env];
const db = {};

let sequelize;
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

// --- CARGA DE MODELOS (ESM + Windows compatible) ---

const files = fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.endsWith(".js") &&
      !file.endsWith(".test.js")
    );
  });

for (const file of files) {
  const filePath = pathToFileURL(path.join(__dirname, file)).href;
  const modelModule = await import(filePath);

  const model = modelModule.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;
