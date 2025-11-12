// src/controllers/carController.js

const db = require('../models');
// Accede al modelo Car (la tabla de autos)
const Car = db.Car; 

// 1. Obtener todos los autos (READ - All)
exports.findAllCars = async (req, res) => {
    try {
        const cars = await Car.findAll({
            // Seleccionar los campos que tu frontend espera ver en el listado
            attributes: ['id', 'brand', 'model', 'price', 'imageUrl', 'isRented'] 
        });

        // Enviar la lista de autos al frontend
        return res.status(200).send(cars);

    } catch (error) {
        console.error("Error al obtener el catálogo:", error);
        // Respuesta en caso de error de base de datos o servidor
        return res.status(500).send({ message: "Error interno al recuperar los autos." });
    }
};

// 2. Obtener un auto por ID (READ - Single)
exports.findCarById = async (req, res) => {
    const id = req.params.id;

    try {
        const car = await Car.findByPk(id, {
            // Seleccionar todos los campos relevantes para la página de detalle
            attributes: ['id', 'brand', 'model', 'price', 'imageUrl', 'description', 'isRented', 'availableUntil']
        });

        if (!car) {
            return res.status(404).send({ message: `Auto con id=${id} no encontrado.` });
        }

        return res.status(200).send(car);
    } catch (error) {
        console.error(`Error al obtener auto ${id}:`, error);
        return res.status(500).send({ message: "Error al recuperar el auto." });
    }
};

// 3. Crear un nuevo auto (CREATE)
exports.createCar = async (req, res) => {
    if (!req.body.brand || !req.body.model || !req.body.price) {
        return res.status(400).send({ message: "Faltan campos obligatorios: brand, model y price." });
    }

    try {
        // Sequilize crea el registro en la DB
        const car = await Car.create(req.body); 
        return res.status(201).send(car); 

    } catch (error) {
        console.error("Error al crear el auto:", error);
        return res.status(500).send({ message: "Error interno al crear el auto." });
    }
};

// 4. Actualizar un auto por ID (UPDATE)
exports.updateCar = async (req, res) => {
    const id = req.params.id;

    try {
        const [num] = await Car.update(req.body, { where: { id: id } });

        if (num === 1) {
            return res.status(200).send({ message: "Auto actualizado exitosamente." });
        } else {
            return res.status(404).send({ message: `Auto con id=${id} no encontrado para actualizar.` });
        }
    } catch (error) {
        console.error(`Error al actualizar auto ${id}:`, error);
        return res.status(500).send({ message: "Error al actualizar el auto." });
    }
};

// 5. Eliminar un auto por ID (DELETE)
exports.deleteCar = async (req, res) => {
    const id = req.params.id;

    try {
        const num = await Car.destroy({ where: { id: id } });

        if (num === 1) {
            return res.status(200).send({ message: "Auto eliminado exitosamente." });
        } else {
            return res.status(404).send({ message: `Auto con id=${id} no encontrado para eliminar.` });
        }
    } catch (error) {
        console.error(`Error al eliminar auto ${id}:`, error);
        return res.status(500).send({ message: "Error al eliminar el auto." });
    }
};