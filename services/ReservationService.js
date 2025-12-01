import db from "../models/index.js";
const { Reservation, Car, User } = db;
import { Op } from "sequelize";

class ReservationServices {
  Reservation = db.Reservation;
  Car = db.Car;
  User = db.User;
  // --- 1. CREAR RESERVA ---
  createReservation = async ({ userId, carId, startDate, endDate }) => {
    try {
      // Validaciones básicas
      if (!userId || !carId || !startDate || !endDate) {
        return {
          message:
            "Todos los campos son requeridos: userId, carId, startDate, endDate",
        };
      }

      // Convertir fechas a objetos Date
      const start = new Date(startDate);
      const end = new Date(endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Validar fechas
      if (start < today) {
        return {
          message: "La fecha de inicio no puede ser en el pasado",
        };
      }

      if (end <= start) {
        return {
          message: "La fecha de fin debe ser posterior a la fecha de inicio",
        };
      }

      // Calcular días de alquiler
      const timeDiff = end.getTime() - start.getTime();
      const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (totalDays < 1) {
        return {
          message: "El período mínimo de alquiler es 1 día",
        };
      }

      // Verificar si el auto existe
      const car = await this.Car.findByPk(carId);
      if (!car) {
        return {
          message: "Auto no encontrado",
        };
      }

      // Verificar si el usuario existe
      const user = await this.User.findByPk(userId);
      if (!user) {
        return {
          message: "Usuario no encontrado",
        };
      }

      // Verificar disponibilidad del auto en las fechas seleccionadas
      const existingReservation = await this.Reservation.findOne({
        where: {
          carId,
          status: {
            [Op.in]: ["confirmed", "active", "pending"],
          },
          [Op.or]: [
            {
              startDate: {
                [Op.between]: [startDate, endDate],
              },
            },
            {
              endDate: {
                [Op.between]: [startDate, endDate],
              },
            },
            {
              [Op.and]: [
                { startDate: { [Op.lte]: startDate } },
                { endDate: { [Op.gte]: endDate } },
              ],
            },
          ],
        },
      });

      if (existingReservation) {
        return {
          message: "El auto no está disponible en las fechas seleccionadas",
        };
      }

      // Calcular precio total
      const totalPrice = car.price * totalDays;

      // Crear la reserva
      const reservation = await this.Reservation.create({
        userId,
        carId,
        startDate,
        endDate,
        totalDays,
        totalPrice,
        status: "confirmed", // Reserva inmediata confirmada
      });

      // Obtener la reserva con datos del auto y usuario
      const reservationWithDetails = await this.Reservation.findByPk(
        reservation.id,
        {
          include: [
            {
              model: Car,
              as: "car",
              attributes: ["id", "brand", "model", "price", "imageUrl"],
            },
            {
              model: User,
              as: "user",
              attributes: ["id", "name", "email"],
            },
          ],
        }
      );

      return {
        message: "Reserva creada exitosamente",
        reservation: reservationWithDetails,
      };
    } catch (error) {
      console.error("Error al crear reserva:", error);
      return {
        message: "Error interno del servidor",
        error: error.message,
      };
    }
  };

  // --- 2. OBTENER RESERVAS DE UN USUARIO ---
  getUserReservations = async ({ userId }) => {
    try {
      const reservations = await this.Reservation.findAll({
        where: { userId },
        include: [
          {
            model: Car,
            as: "car",
            attributes: [
              "id",
              "brand",
              "model",
              "price",
              "imageUrl",
              "description",
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return {
        reservations,
        count: reservations.length,
      };
    } catch (error) {
      console.error("Error al obtener reservas:", error);
      return {
        message: "Error interno del servidor",
        error: error.message,
      };
    }
  };

  // --- 3. OBTENER UNA RESERVA POR ID ---
  getReservationById = async ({ id }) => {
    try {
      const reservation = await this.Reservation.findByPk(id, {
        include: [
          {
            model: Car,
            as: "car",
            attributes: [
              "id",
              "brand",
              "model",
              "price",
              "imageUrl",
              "description",
            ],
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      if (!reservation) {
        return {
          message: "Reserva no encontrada",
        };
      }

      return { reservation };
    } catch (error) {
      console.error("Error al obtener reserva:", error);
      return {
        message: "Error interno del servidor",
        error: error.message,
      };
    }
  };

  // --- 4. ACTUALIZAR RESERVA ---
  updateReservation = async ({ id, startDate, endDate }) => {
    try {
      // Buscar la reserva
      const reservation = await this.Reservation.findByPk(id, {
        include: [
          {
            model: Car,
            as: "car",
          },
        ],
      });

      if (!reservation) {
        return {
          message: "Reserva no encontrada",
        };
      }

      // Solo permitir modificar reservas confirmadas
      if (reservation.status !== "confirmed") {
        return {
          message: "Solo se pueden modificar reservas confirmadas",
        };
      }

      // Si se envían nuevas fechas, verificar disponibilidad
      if (startDate || endDate) {
        const newStartDate = startDate || reservation.startDate;
        const newEndDate = endDate || reservation.endDate;

        const start = new Date(newStartDate);
        const end = new Date(newEndDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Validar nuevas fechas
        if (start < today) {
          return {
            message: "La fecha de inicio no puede ser en el pasado",
          };
        }

        if (end <= start) {
          return {
            message: "La fecha de fin debe ser posterior a la fecha de inicio",
          };
        }

        // Calcular nuevos días
        const timeDiff = end.getTime() - start.getTime();
        const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (totalDays < 1) {
          return {
            message: "El período mínimo de alquiler es 1 día",
          };
        }

        // Verificar disponibilidad (excluyendo la reserva actual)
        const existingReservation = await this.Reservation.findOne({
          where: {
            carId: reservation.carId,
            id: { [Op.ne]: id }, // Excluir la reserva actual
            status: {
              [Op.in]: ["confirmed", "active", "pending"],
            },
            [Op.or]: [
              {
                startDate: {
                  [Op.between]: [newStartDate, newEndDate],
                },
              },
              {
                endDate: {
                  [Op.between]: [newStartDate, newEndDate],
                },
              },
              {
                [Op.and]: [
                  { startDate: { [Op.lte]: newStartDate } },
                  { endDate: { [Op.gte]: newEndDate } },
                ],
              },
            ],
          },
        });

        if (existingReservation) {
          return {
            message:
              "El auto no está disponible en las nuevas fechas seleccionadas",
          };
        }

        // Actualizar fechas y precio
        reservation.startDate = newStartDate;
        reservation.endDate = newEndDate;
        reservation.totalDays = totalDays;
        reservation.totalPrice = reservation.car.price * totalDays;
      }

      await reservation.save();

      // Obtener reserva actualizada con relaciones
      const updatedReservation = await this.Reservation.findByPk(id, {
        include: [
          {
            model: Car,
            as: "car",
            attributes: ["id", "brand", "model", "price", "imageUrl"],
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      return {
        message: "Reserva actualizada exitosamente",
        reservation: updatedReservation,
      };
    } catch (error) {
      console.error("Error al actualizar reserva:", error);
      return {
        message: "Error interno del servidor",
        error: error.message,
      };
    }
  };

  // --- 5. CANCELAR RESERVA ---
  cancelReservation = async ({ id }) => {
    try {
      const reservation = await this.Reservation.findByPk(id);

      if (!reservation) {
        return {
          message: "Reserva no encontrada",
        };
      }

      // Solo permitir cancelar reservas confirmadas
      if (reservation.status !== "confirmed") {
        return {
          message: "Solo se pueden cancelar reservas confirmadas",
        };
      }

      // Cambiar estado a cancelado
      reservation.status = "cancelled";
      await reservation.save();

      return {
        message: "Reserva cancelada exitosamente",
        reservation,
      };
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
      return {
        message: "Error interno del servidor",
        error: error.message,
      };
    }
  };

  // --- 6. VERIFICAR DISPONIBILIDAD ---
  checkAvailability = async ({ carId, startDate, endDate }) => {
    try {
      if (!carId || !startDate || !endDate) {
        return {
          message: "carId, startDate y endDate son requeridos",
        };
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start) {
        return {
          message: "La fecha de fin debe ser posterior a la fecha de inicio",
        };
      }

      // Verificar disponibilidad
      const existingReservation = await this.Reservation.findOne({
        where: {
          carId,
          status: {
            [Op.in]: ["confirmed", "active", "pending"],
          },
          [Op.or]: [
            {
              startDate: {
                [Op.between]: [startDate, endDate],
              },
            },
            {
              endDate: {
                [Op.between]: [startDate, endDate],
              },
            },
            {
              [Op.and]: [
                { startDate: { [Op.lte]: startDate } },
                { endDate: { [Op.gte]: endDate } },
              ],
            },
          ],
        },
      });

      const isAvailable = !existingReservation;

      return {
        isAvailable,
        message: isAvailable
          ? "El auto está disponible en las fechas seleccionadas"
          : "El auto no está disponible en las fechas seleccionadas",
        carId,
        startDate,
        endDate,
      };
    } catch (error) {
      console.error("Error al verificar disponibilidad:", error);
      return {
        message: "Error interno del servidor",
        error: error.message,
      };
    }
  };

  // --- 7. CANCELAR RESERVA ACTIVA POR CAR ID (NUEVO MÉTODO) ---
  cancelActiveReservationByCar = async ({ carId }) => {
    try {
      // Buscar reserva activa para este auto
      const activeReservation = await this.Reservation.findOne({
        where: {
          carId: carId,
          status: {
            [Op.in]: ["confirmed", "active"],
          },
          endDate: {
            [Op.gte]: new Date(),
          },
        },
        include: [
          {
            model: Car,
            as: "car",
            attributes: ["id", "brand", "model"],
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
      });

      if (!activeReservation) {
        return {
          message: "No se encontró una reserva activa para este auto",
        };
      }

      // Cancelar la reserva
      activeReservation.status = "cancelled";
      await activeReservation.save();

      return {
        message: "Reserva activa cancelada exitosamente",
        reservation: activeReservation,
      };
    } catch (error) {
      console.error("Error al cancelar reserva activa:", error);
      return {
        message: "Error interno del servidor",
        error: error.message,
      };
    }
  };

  getAllReservations = async () => {
    try {
      const reservations = await this.Reservation.findAll({
        include: [
          {
            model: Car,
            as: "car",
            attributes: ["id", "brand", "model", "price", "imageUrl"],
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return {
        reservations,
        count: reservations.length,
      };
    } catch (error) {
      console.error("Error al obtener todas las reservas:", error);
      return {
        message: "Error interno del servidor",
        error: error.message,
      };
    }
  };

  getActiveReservations = async () => {
    try {
      const reservations = await this.Reservation.findAll({
        where: {
          status: {
            [Op.in]: ["confirmed", "active"],
          },
          endDate: {
            [Op.gte]: new Date(),
          },
        },
        include: [
          {
            model: Car,
            as: "car",
            attributes: ["id", "brand", "model"],
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
          },
        ],
        order: [["startDate", "ASC"]],
      });

      return reservations;
    } catch (error) {
      console.error("Error al obtener reservas activas:", error);
      return {
        message: "Error interno del servidor",
        error: error.message,
      };
    }
  };

  getBlockedDates = async ({ carId }) => {
    try {
      console.log("📅 Fetching blocked dates for car:", carId);

      // Validar carId
      if (!carId || isNaN(parseInt(carId))) {
        return {
          error: "ID de auto inválido",
        };
      }

      const reservations = await Reservation.findAll({
        where: {
          carId: parseInt(carId),
          status: ["confirmed", "active"],
        },
        attributes: ["startDate", "endDate"],
      });

      console.log("📅 Found reservations:", reservations.length);

      const blockedDates = [];

      reservations.forEach((reservation) => {
        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate);

        // Generar rango de fechas
        for (
          let date = new Date(start);
          date <= end;
          date.setDate(date.getDate() + 1)
        ) {
          blockedDates.push(date.toISOString().split("T")[0]);
        }
      });

      // Eliminar duplicados (por si acaso)
      const uniqueBlockedDates = [...new Set(blockedDates)].sort();

      console.log("📅 Unique blocked dates:", uniqueBlockedDates.length);

      return {
        blockedDates: uniqueBlockedDates,
        count: uniqueBlockedDates.length,
      };
    } catch (error) {
      console.error("❌ Error getting blocked dates:", error);
      return {
        error: "Error interno del servidor",
        message: error.message,
      };
    }
  };
}

export default ReservationServices;
