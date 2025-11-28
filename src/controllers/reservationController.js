import db from "../models/index.js";
const { Reservation, Car, User } = db;
import { Op } from "sequelize";
import ReservationServices from "../services/ReservationServices.js";

class ReservationController {
  reservationServices = new ReservationServices();

  // --- 1. CREAR RESERVA ---
  createReservation = () => this.reservationServices.createReservation;

  // --- 2. OBTENER RESERVAS DE UN USUARIO ---
  getUserReservations = () => this.reservationServices.getUserReservations;

  // --- 3. OBTENER UNA RESERVA POR ID ---
  getReservationById = () => this.reservationServices.getReservationById;

  // --- 4. ACTUALIZAR RESERVA ---
  updateReservation = () => this.reservationServices.updateReservation;

  // --- 5. CANCELAR RESERVA ---
  cancelReservation = () => this.reservationServices.cancelReservation;
  // --- 6. VERIFICAR DISPONIBILIDAD ---
  checkAvailability = () => this.reservationServices.checkAvailability;

  // --- 7. CANCELAR RESERVA ACTIVA POR CAR ID (NUEVO MÉTODO) ---
  cancelActiveReservationByCar = () =>
    this.reservationServices.cancelActiveReservationByCar;

  getAllReservations = () => this.reservationServices.getAllReservations;

  getActiveReservations = () => this.reservationServices.getActiveReservations;

  getBlockedDates = () => this.reservationServices.getBlockedDates;
}

export default ReservationController;
