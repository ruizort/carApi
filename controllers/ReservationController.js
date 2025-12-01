import ReservationServices from "../services/ReservationServices.js";

class ReservationController {
  reservationServices = new ReservationServices();

  // --- 1. CREAR RESERVA ---
  createReservation = async (req, res) => {
    try {
      const { userId, carId, startDate, endDate } = req.body;
      const result = await this.reservationServices.createReservation({
        userId,
        carId,
        startDate,
        endDate,
      });
      // Validaciones básicas
      if (
        result.message ===
        "Todos los campos son requeridos: userId, carId, startDate, endDate"
      ) {
        return res.status(400).json({
          message:
            "Todos los campos son requeridos: userId, carId, startDate, endDate",
        });
      }

      // Validar fechas
      if (result.message === "La fecha de inicio no puede ser en el pasado") {
        return res.status(400).json({
          message: "La fecha de inicio no puede ser en el pasado",
        });
      }

      if (
        result.message ===
        "La fecha de fin debe ser posterior a la fecha de inicio"
      ) {
        return res.status(400).json({
          message: "La fecha de fin debe ser posterior a la fecha de inicio",
        });
      }

      if (result.message === "El período mínimo de alquiler es 1 día") {
        return res.status(400).json({
          message: "El período mínimo de alquiler es 1 día",
        });
      }

      if (result.message === "Auto no encontrado") {
        return res.status(404).json({
          message: "Auto no encontrado",
        });
      }

      if (result.message === "Usuario no encontrado") {
        return res.status(404).json({
          message: "Usuario no encontrado",
        });
      }

      if (
        result.message ===
        "El auto no está disponible en las fechas seleccionadas"
      ) {
        return res.status(409).json({
          message: "El auto no está disponible en las fechas seleccionadas",
        });
      }

      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  };

  // --- 2. OBTENER RESERVAS DE UN USUARIO ---
  getUserReservations = async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await this.reservationServices.getUserReservations({
        userId,
      });

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  };

  // --- 3. OBTENER UNA RESERVA POR ID ---
  getReservationById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.reservationServices.getReservationById({ id });

      if (result.message === "Reserva no encontrada") {
        return res.status(404).json({
          message: "Reserva no encontrada",
        });
      }

      return res.json(result.reservation);
    } catch (error) {
      return res.status(500).json({
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  };

  // --- 4. ACTUALIZAR RESERVA ---
  updateReservation = async (req, res) => {
    try {
      const { id } = req.params;
      const { startDate, endDate } = req.body;
      const result = await this.reservationServices.updateReservation({
        id,
        startDate,
        endDate,
      });
      if (result.message === "Reserva no encontrada") {
        return res.status(404).json({
          message: "Reserva no encontrada",
        });
      }

      // Solo permitir modificar reservas confirmadas
      if (result.message === "Solo se pueden modificar reservas confirmadas") {
        return res.status(400).json({
          message: "Solo se pueden modificar reservas confirmadas",
        });
      }

      // Validar nuevas fechas
      if (result.message === "La fecha de inicio no puede ser en el pasado") {
        return res.status(400).json({
          message: "La fecha de inicio no puede ser en el pasado",
        });
      }

      if (
        result.message ===
        "La fecha de fin debe ser posterior a la fecha de inicio"
      ) {
        return res.status(400).json({
          message: "La fecha de fin debe ser posterior a la fecha de inicio",
        });
      }

      if (result.message === "El período mínimo de alquiler es 1 día") {
        return res.status(400).json({
          message: "El período mínimo de alquiler es 1 día",
        });
      }

      if (
        result.message ===
        "El auto no está disponible en las nuevas fechas seleccionadas"
      ) {
        return res.status(409).json({
          message:
            "El auto no está disponible en las nuevas fechas seleccionadas",
        });
      }

      return res.json({
        message: result.message,
        reservation: result.reservation,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  };

  // --- 5. CANCELAR RESERVA ---
  cancelReservation = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.reservationServices.cancelReservation({ id });

      if (result.message === "Reserva no encontrada") {
        return res.status(404).json({
          message: "Reserva no encontrada",
        });
      }

      // Solo permitir cancelar reservas confirmadas
      if (result.message === "Solo se pueden cancelar reservas confirmadas") {
        return res.status(400).json({
          message: "Solo se pueden cancelar reservas confirmadas",
        });
      }

      return res.json({
        message: result.message,
        reservation: result.reservation,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  };

  // --- 6. VERIFICAR DISPONIBILIDAD ---
  checkAvailability = async (req, res) => {
    try {
      const { carId, startDate, endDate } = req.query;
      const result = await this.reservationServices.checkAvailability({
        carId,
        startDate,
        endDate,
      });
      if (result.message === "carId, startDate y endDate son requeridos") {
        return res.status(400).json({
          message: "carId, startDate y endDate son requeridos",
        });
      }

      if (
        result.message ===
        "La fecha de fin debe ser posterior a la fecha de inicio"
      ) {
        return res.status(400).json({
          message: "La fecha de fin debe ser posterior a la fecha de inicio",
        });
      }

      return res.json(result);
    } catch (error) {
      res.status(500).json({
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  };

  // --- 7. CANCELAR RESERVA ACTIVA POR CAR ID (NUEVO MÉTODO) ---
  cancelActiveReservationByCar = async (req, res) => {
    try {
      const { carId } = req.params;
      const result =
        await this.reservationServices.cancelActiveReservationByCar({ carId });

      if (
        result.message === "No se encontró una reserva activa para este auto"
      ) {
        return res.status(404).json({
          message: "No se encontró una reserva activa para este auto",
        });
      }

      return res.json({
        message: result.message,
        reservation: result.reservation,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  };

  getAllReservations = async (req, res) => {
    try {
      const result = await this.reservationServices.getAllReservations();

      // Si hay error desde el service
      if (result.error) {
        return res.status(500).json(result);
      }

      return res.json({
        reservations: result.reservations,
        count: result.count,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  };

  getActiveReservations = async (req, res) => {
    try {
      const result = await this.reservationServices.getActiveReservations();
      // Si hay error desde el service
      if (result.error) {
        return res.status(500).json(result);
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({
        message: "Error interno del servidor",
        error: error.message,
      });
    }
  };

  getBlockedDates = async (req, res) => {
    try {
      const { carId } = req.params;
      const result = await this.reservationServices.getBlockedDates({ carId });
      // Validar carId
      if (result.error === "ID de auto inválido") {
        return res.status(400).json({
          error: "ID de auto inválido",
        });
      }

      return res.json({
        blockedDates: result.blockedDates,
        count: result.count,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Error interno del servidor",
        message: error.message,
      });
    }
  };
}

export default ReservationController;
