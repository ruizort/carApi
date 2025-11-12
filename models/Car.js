// models/Car.js

'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    static associate(models) {
      // configurar despues asociaciones
    }
  }
  Car.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true 
    },
    description: { // ✨ CAMPO AÑADIDO
      type: DataTypes.TEXT,
      allowNull: true
    },
    isRented: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    availableUntil: { 
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Car',
    tableName: 'Cars',
  });
  return Car;
};