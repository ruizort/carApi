import db from "../models/index.js";
import { Op } from "sequelize";

const Car = db.Car;
const Reservation = db.Reservation;

// Función helper para verificar disponibilidad (usa tu lógica existente)
const checkCarAvailability = async (carId) => {
  const today = new Date();

  const activeReservation = await Reservation.findOne({
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
const findAllCars = async (req, res) => {
  try {
    const cars = await Car.findAll({
      attributes: ["id", "brand", "model", "price", "imageUrl", "description"],
    });

    // Enriquecer con información de disponibilidad
    const carsWithAvailability = await Promise.all(
      cars.map(async (car) => {
        const availability = await checkCarAvailability(car.id);

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

    return res.status(200).send(carsWithAvailability);
  } catch (error) {
    console.error("Error al obtener el catálogo:", error);
    return res
      .status(500)
      .send({ message: "Error interno al recuperar los autos." });
  }
};

// 2. Obtener un auto por ID con disponibilidad
const findCarById = async (req, res) => {
  const id = req.params.id;

  try {
    const car = await Car.findByPk(id, {
      attributes: ["id", "brand", "model", "price", "imageUrl", "description"],
    });

    if (!car) {
      return res
        .status(404)
        .send({ message: `Auto con id=${id} no encontrado.` });
    }

    // Agregar información de disponibilidad
    const availability = await checkCarAvailability(car.id);

    const carWithAvailability = {
      ...car.toJSON(),
      isAvailable: availability.isAvailable,
      nextAvailableDate: availability.nextAvailableDate,
      // Para compatibilidad con el frontend existente
      isRented: !availability.isAvailable,
      availableUntil: availability.nextAvailableDate,
    };

    return res.status(200).send(carWithAvailability);
  } catch (error) {
    console.error(`Error al obtener auto ${id}:`, error);
    return res.status(500).send({ message: "Error al recuperar el auto." });
  }
};

// 3. Crear un nuevo auto (CREATE)
const createCar = async (req, res) => {
  const { brand, model, price, imageUrl, description } = req.body;

  // ✅ VALIDACIÓN 1: Campos obligatorios
  if (!brand || !model || !price) {
    return res.status(400).send({
      message:
        "Faltan campos obligatorios. 'brand', 'model' y 'price' son requeridos.",
    });
  }

  // ✅ VALIDACIÓN 2: Tipos de datos y lógica
  if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
    return res.status(400).send({
      message: "El precio debe ser un número positivo válido.",
    });
  }

  try {
    const newCar = {
      brand,
      model,
      price,
      description: description || "", // Opcional
      imageUrl: imageUrl || null, // Opcional
    };

    const car = await Car.create(newCar);
    return res.status(201).send(car);
  } catch (error) {
    console.error("Error al crear el auto:", error);
    return res.status(500).send({ message: "Error interno al crear el auto." });
  }
};

// 4. Actualizar un auto por ID (UPDATE)
const updateCar = async (req, res) => {
  const id = req.params.id;

  try {
    const [num] = await Car.update(req.body, { where: { id: id } });

    if (num === 1) {
      return res
        .status(200)
        .send({ message: "Auto actualizado exitosamente." });
    } else {
      return res
        .status(404)
        .send({ message: `Auto con id=${id} no encontrado para actualizar.` });
    }
  } catch (error) {
    console.error(`Error al actualizar auto ${id}:`, error);
    return res.status(500).send({ message: "Error al actualizar el auto." });
  }
};

// 5. Eliminar un auto por ID (DELETE)
const deleteCar = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await Car.destroy({ where: { id: id } });

    if (num === 1) {
      return res.status(200).send({ message: "Auto eliminado exitosamente." });
    } else {
      return res
        .status(404)
        .send({ message: `Auto con id=${id} no encontrado para eliminar.` });
    }
  } catch (error) {
    console.error(`Error al eliminar auto ${id}:`, error);
    return res.status(500).send({ message: "Error al eliminar el auto." });
  }
};

export { findAllCars, findCarById, createCar, updateCar, deleteCar };
