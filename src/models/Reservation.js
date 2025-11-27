// models/Reservation.js
"use strict";
import { Model } from "sequelize";

//Lo mismo que otros modelos hay que sacar las clases de adentro de la funcion
export default (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      // Una reserva pertenece a un usuario
      Reservation.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // Una reserva pertenece a un auto
      Reservation.belongsTo(models.Car, {
        foreignKey: "carId",
        as: "car",
      });
    }
  }

  Reservation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      carId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Cars",
          key: "id",
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "confirmed",
          "active",
          "completed",
          "cancelled"
        ),
        defaultValue: "pending",
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Reservation",
      tableName: "Reservations",
    }
  );

  return Reservation;
};
