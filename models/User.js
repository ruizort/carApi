'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: { // Para el Login
      type: DataTypes.STRING,
      allowNull: false,
      unique: true // Asegura que no haya emails duplicados
    },
    password: { // Almacenará el HASH de la contraseña
      type: DataTypes.STRING,
      allowNull: false
    },
    role: { // Para la Autorización
      type: DataTypes.ENUM('admin', 'user'), // Solo permite estos dos valores
      defaultValue: 'user',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // Nombre real de la tabla en la DB
  });
  return User;
};