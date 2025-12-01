class CarController {
  constructor(service) {
    this.carServices = service;
  }

  // 1. Obtener todos los autos con información de disponibilidad
  findAllCars = async (req, res) => {
    try {
      const result = await this.carServices.findAllCars();

      if (result.message === "Error interno al recuperar los autos.") {
        return res
          .status(500)
          .send({ message: "Error interno al recuperar los autos." });
      }
      return res.status(200).send(result);
    } catch (error) {
      console.error("Error al obtener el catálogo:", error);
      return res
        .status(500)
        .send({ message: "Error interno al recuperar los autos." });
    }
  };

  // 2. Obtener un auto por ID con disponibilidad
  findCarById = async (req, res) => {
    const id = req.params.id;

    try {
      const result = await this.carServices.findCarById({ id });

      if (result.message === `Auto con id=${id} no encontrado.`) {
        return res
          .status(404)
          .send({ message: `Auto con id=${id} no encontrado.` });
      }

      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send({ message: "Error al recuperar el auto." });
    }
  };

  // 3. Crear un nuevo auto (CREATE)
  createCar = async (req, res) => {
    const { brand, model, price, imageUrl, description } = req.body;

    try {
      const result = await this.carServices.createCar({
        brand,
        model,
        price,
        imageUrl,
        description,
      });

      // ✅ VALIDACIÓN 1: Campos obligatorios
      if (
        result.message ===
        "Faltan campos obligatorios. 'brand', 'model' y 'price' son requeridos."
      ) {
        return res.status(400).send({
          message:
            "Faltan campos obligatorios. 'brand', 'model' y 'price' son requeridos.",
        });
      }

      // ✅ VALIDACIÓN 2: Tipos de datos y lógica
      if (result.message === "El precio debe ser un número positivo válido.") {
        return res.status(400).send({
          message: "El precio debe ser un número positivo válido.",
        });
      }

      return res.status(201).send(result);
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Error interno al crear el auto." });
    }
  };

  // 4. Actualizar un auto por ID (UPDATE)
  updateCar = async (req, res) => {
    const id = req.params.id;

    try {
      const result = await this.carServices.updateCar({ id, data: req.body });

      if (result.message === "Auto actualizado exitosamente.") {
        return res
          .status(200)
          .send({ message: "Auto actualizado exitosamente." });
      } else {
        return res.status(404).send({
          message: `Auto con id=${id} no encontrado para actualizar.`,
        });
      }
    } catch (error) {
      return res.status(500).send({ message: "Error al actualizar el auto." });
    }
  };

  // 5. Eliminar un auto por ID (DELETE)
  deleteCar = async (req, res) => {
    const id = req.params.id;

    try {
      const result = await this.carServices.deleteCar({ id });

      if (result.message === "Auto eliminado exitosamente.") {
        return res
          .status(200)
          .send({ message: "Auto eliminado exitosamente." });
      } else {
        return res
          .status(404)
          .send({ message: `Auto con id=${id} no encontrado para eliminar.` });
      }
    } catch (error) {
      return res.status(500).send({ message: "Error al eliminar el auto." });
    }
  };
}

export default CarController;
