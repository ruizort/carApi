// models/Car.js
'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    static associate(models) {
      // ✅ AGREGAR: Un auto puede tener muchas reservas
      Car.hasMany(models.Reservation, {
        foreignKey: 'carId',
        as: 'reservations'
      });
    }
  }
  
  // models/Car.js
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
  // ELIMINAR: isRented y availableUntil
}, {
  sequelize,
  modelName: 'Car',
  tableName: 'Cars',
});
  
  return Car;
};