import db from "../models/index.js";
import { Op } from "sequelize";

class CarServices {
  Car = db.Car;
  Reservation = db.Reservation;

  checkCarAvailability = async (carId) => {
    const today = new Date();

    const activeReservation = await this.Reservation.findOne({
      where: {
        carId,
        status: {
          [Op.in]: ["confirmed", "active", "pending"],
        },
        [Op.or]: [
          {
            startDate: {
              [Op.lte]: today,
            },
            endDate: {
              [Op.gte]: today,
            },
          },
          {
            startDate: {
              [Op.gte]: today,
            },
          },
        ],
      },
      order: [["startDate", "ASC"]],
    });

    return {
      isAvailable: !activeReservation,
      nextAvailableDate: activeReservation ? activeReservation.endDate : null,
      activeReservation: activeReservation,
    };
  };

  // 1. Obtener todos los autos con información de disponibilidad
  findAllCars = async () => {
    try {
      const cars = await this.Car.findAll({
        attributes: [
          "id",
          "brand",
          "model",
          "price",
          "imageUrl",
          "description",
        ],
      });

      // Enriquecer con información de disponibilidad
      const carsWithAvailability = await Promise.all(
        cars.map(async (car) => {
          const availability = await this.checkCarAvailability(car.id);

          return {
            ...car.toJSON(),
            isAvailable: availability.isAvailable,
            nextAvailableDate: availability.nextAvailableDate,
            // Para compatibilidad con el frontend existente
            isRented: !availability.isAvailable,
            availableUntil: availability.nextAvailableDate,
          };
        })
      );

      return carsWithAvailability;
    } catch (error) {
      console.error("Error al obtener el catálogo:", error);
      return { message: "Error interno al recuperar los autos." };
    }
  };

  // 2. Obtener un auto por ID con disponibilidad
  findCarById = async ({ id }) => {
    try {
      const car = await this.Car.findByPk(id, {
        attributes: [
          "id",
          "brand",
          "model",
          "price",
          "imageUrl",
          "description",
        ],
      });

      if (!car) {
        return { message: `Auto con id=${id} no encontrado.` };
      }

      // Agregar información de disponibilidad
      const availability = await this.checkCarAvailability(car.id);

      const carWithAvailability = {
        ...car.toJSON(),
        isAvailable: availability.isAvailable,
        nextAvailableDate: availability.nextAvailableDate,
        // Para compatibilidad con el frontend existente
        isRented: !availability.isAvailable,
        availableUntil: availability.nextAvailableDate,
      };

      return carWithAvailability;
    } catch (error) {
      console.error(`Error al obtener auto ${id}:`, error);
      return { message: "Error al recuperar el auto." };
    }
  };

  // 3. Crear un nuevo auto (CREATE)
  createCar = async ({ brand, model, price, imageUrl, description }) => {
    // ✅ VALIDACIÓN 1: Campos obligatorios
    if (!brand || !model || !price) {
      return {
        message:
          "Faltan campos obligatorios. 'brand', 'model' y 'price' son requeridos.",
      };
    }

    // ✅ VALIDACIÓN 2: Tipos de datos y lógica
    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      return {
        message: "El precio debe ser un número positivo válido.",
      };
    }

    try {
      const newCar = {
        brand,
        model,
        price,
        description: description || "", // Opcional
        imageUrl: imageUrl || null, // Opcional
      };

      const car = await this.Car.create(newCar);
      return car;
    } catch (error) {
      console.error("Error al crear el auto:", error);
      return { message: "Error interno al crear el auto." };
    }
  };

  // 4. Actualizar un auto por ID (UPDATE)
  updateCar = async ({ id, data }) => {
    try {
      const [num] = await this.Car.update(data, { where: { id: id } });

      if (num === 1) {
        return { message: "Auto actualizado exitosamente." };
      } else {
        return {
          message: `Auto con id=${id} no encontrado para actualizar.`,
        };
      }
    } catch (error) {
      console.error(`Error al actualizar auto ${id}:`, error);
      return { message: "Error al actualizar el auto." };
    }
  };

  // 5. Eliminar un auto por ID (DELETE)
  deleteCar = async ({ id }) => {
    try {
      const num = await this.Car.destroy({ where: { id: id } });

      if (num === 1) {
        return { message: "Auto eliminado exitosamente." };
      } else {
        return { message: `Auto con id=${id} no encontrado para eliminar.` };
      }
    } catch (error) {
      console.error(`Error al eliminar auto ${id}:`, error);
      return { message: "Error al eliminar el auto." };
    }
  };
}

export default CarServices;
