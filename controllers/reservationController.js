const { Reservation, Car, User } = require('../models');
const { Op } = require('sequelize');

// --- 1. CREAR RESERVA ---
exports.createReservation = async (req, res) => {
  try {
    const { userId, carId, startDate, endDate } = req.body;

    // Validaciones básicas
    if (!userId || !carId || !startDate || !endDate) {
      return res.status(400).json({
        message: 'Todos los campos son requeridos: userId, carId, startDate, endDate'
      });
    }

    // Convertir fechas a objetos Date
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validar fechas
    if (start < today) {
      return res.status(400).json({
        message: 'La fecha de inicio no puede ser en el pasado'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      });
    }

    // Calcular días de alquiler
    const timeDiff = end.getTime() - start.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (totalDays < 1) {
      return res.status(400).json({
        message: 'El período mínimo de alquiler es 1 día'
      });
    }

    // Verificar si el auto existe
    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({
        message: 'Auto no encontrado'
      });
    }

    // Verificar si el usuario existe
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    // Verificar disponibilidad del auto en las fechas seleccionadas
    const existingReservation = await Reservation.findOne({
      where: {
        carId,
        status: {
          [Op.in]: ['confirmed', 'active', 'pending']
        },
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } }
            ]
          }
        ]
      }
    });

    if (existingReservation) {
      return res.status(409).json({
        message: 'El auto no está disponible en las fechas seleccionadas'
      });
    }

    // Calcular precio total
    const totalPrice = car.price * totalDays;

    // Crear la reserva
    const reservation = await Reservation.create({
      userId,
      carId,
      startDate,
      endDate,
      totalDays,
      totalPrice,
      status: 'confirmed' // Reserva inmediata confirmada
    });

    // Obtener la reserva con datos del auto y usuario
    const reservationWithDetails = await Reservation.findByPk(reservation.id, {
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'brand', 'model', 'price', 'imageUrl']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.status(201).json({
      message: 'Reserva creada exitosamente',
      reservation: reservationWithDetails
    });

  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// --- 2. OBTENER RESERVAS DE UN USUARIO ---
exports.getUserReservations = async (req, res) => {
  try {
    const { userId } = req.params;

    const reservations = await Reservation.findAll({
      where: { userId },
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'brand', 'model', 'price', 'imageUrl', 'description']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      reservations,
      count: reservations.length
    });

  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// --- 3. OBTENER UNA RESERVA POR ID ---
exports.getReservationById = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id, {
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'brand', 'model', 'price', 'imageUrl', 'description']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!reservation) {
      return res.status(404).json({
        message: 'Reserva no encontrada'
      });
    }

    res.json(reservation);

  } catch (error) {
    console.error('Error al obtener reserva:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// --- 4. ACTUALIZAR RESERVA ---
exports.updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    // Buscar la reserva
    const reservation = await Reservation.findByPk(id, {
      include: [
        {
          model: Car,
          as: 'car'
        }
      ]
    });

    if (!reservation) {
      return res.status(404).json({
        message: 'Reserva no encontrada'
      });
    }

    // Solo permitir modificar reservas confirmadas
    if (reservation.status !== 'confirmed') {
      return res.status(400).json({
        message: 'Solo se pueden modificar reservas confirmadas'
      });
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
        return res.status(400).json({
          message: 'La fecha de inicio no puede ser en el pasado'
        });
      }

      if (end <= start) {
        return res.status(400).json({
          message: 'La fecha de fin debe ser posterior a la fecha de inicio'
        });
      }

      // Calcular nuevos días
      const timeDiff = end.getTime() - start.getTime();
      const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (totalDays < 1) {
        return res.status(400).json({
          message: 'El período mínimo de alquiler es 1 día'
        });
      }

      // Verificar disponibilidad (excluyendo la reserva actual)
      const existingReservation = await Reservation.findOne({
        where: {
          carId: reservation.carId,
          id: { [Op.ne]: id }, // Excluir la reserva actual
          status: {
            [Op.in]: ['confirmed', 'active', 'pending']
          },
          [Op.or]: [
            {
              startDate: {
                [Op.between]: [newStartDate, newEndDate]
              }
            },
            {
              endDate: {
                [Op.between]: [newStartDate, newEndDate]
              }
            },
            {
              [Op.and]: [
                { startDate: { [Op.lte]: newStartDate } },
                { endDate: { [Op.gte]: newEndDate } }
              ]
            }
          ]
        }
      });

      if (existingReservation) {
        return res.status(409).json({
          message: 'El auto no está disponible en las nuevas fechas seleccionadas'
        });
      }

      // Actualizar fechas y precio
      reservation.startDate = newStartDate;
      reservation.endDate = newEndDate;
      reservation.totalDays = totalDays;
      reservation.totalPrice = reservation.car.price * totalDays;
    }

    await reservation.save();

    // Obtener reserva actualizada con relaciones
    const updatedReservation = await Reservation.findByPk(id, {
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'brand', 'model', 'price', 'imageUrl']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      message: 'Reserva actualizada exitosamente',
      reservation: updatedReservation
    });

  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// --- 5. CANCELAR RESERVA ---
exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      return res.status(404).json({
        message: 'Reserva no encontrada'
      });
    }

    // Solo permitir cancelar reservas confirmadas
    if (reservation.status !== 'confirmed') {
      return res.status(400).json({
        message: 'Solo se pueden cancelar reservas confirmadas'
      });
    }

    // Cambiar estado a cancelado
    reservation.status = 'cancelled';
    await reservation.save();

    res.json({
      message: 'Reserva cancelada exitosamente',
      reservation
    });

  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// --- 6. VERIFICAR DISPONIBILIDAD ---
exports.checkAvailability = async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.query;

    if (!carId || !startDate || !endDate) {
      return res.status(400).json({
        message: 'carId, startDate y endDate son requeridos'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.status(400).json({
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      });
    }

    // Verificar disponibilidad
    const existingReservation = await Reservation.findOne({
      where: {
        carId,
        status: {
          [Op.in]: ['confirmed', 'active', 'pending']
        },
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: startDate } },
              { endDate: { [Op.gte]: endDate } }
            ]
          }
        ]
      }
    });

    const isAvailable = !existingReservation;

    res.json({
      isAvailable,
      message: isAvailable 
        ? 'El auto está disponible en las fechas seleccionadas' 
        : 'El auto no está disponible en las fechas seleccionadas',
      carId,
      startDate,
      endDate
    });

  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// --- 7. CANCELAR RESERVA ACTIVA POR CAR ID (NUEVO MÉTODO) ---
exports.cancelActiveReservationByCar = async (req, res) => {
  try {
    const { carId } = req.params;

    // Buscar reserva activa para este auto
    const activeReservation = await Reservation.findOne({
      where: {
        carId: carId,
        status: {
          [Op.in]: ['confirmed', 'active']
        },
        endDate: {
          [Op.gte]: new Date()
        }
      },
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'brand', 'model']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!activeReservation) {
      return res.status(404).json({
        message: 'No se encontró una reserva activa para este auto'
      });
    }

    // Cancelar la reserva
    activeReservation.status = 'cancelled';
    await activeReservation.save();

    res.json({
      message: 'Reserva activa cancelada exitosamente',
      reservation: activeReservation
    });

  } catch (error) {
    console.error('Error al cancelar reserva activa:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'brand', 'model', 'price', 'imageUrl']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      reservations,
      count: reservations.length
    });

  } catch (error) {
    console.error('Error al obtener todas las reservas:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

exports.getActiveReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      where: {
        status: {
          [Op.in]: ['confirmed', 'active']
        },
        endDate: {
          [Op.gte]: new Date()
        }
      },
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'brand', 'model']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['startDate', 'ASC']]
    });

    res.json(reservations);

  } catch (error) {
    console.error('Error al obtener reservas activas:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

exports.getBlockedDates = async (req, res) => {
  try {
    const { carId } = req.params;
    
    console.log('📅 Fetching blocked dates for car:', carId);

    // Validar carId
    if (!carId || isNaN(parseInt(carId))) {
      return res.status(400).json({ 
        error: 'ID de auto inválido' 
      });
    }

    const reservations = await Reservation.findAll({
      where: { 
        carId: parseInt(carId),
        status: ['confirmed', 'active']
      },
      attributes: ['startDate', 'endDate']
    });

    console.log('📅 Found reservations:', reservations.length);

    const blockedDates = [];
    
    reservations.forEach(reservation => {
      const start = new Date(reservation.startDate);
      const end = new Date(reservation.endDate);
      
      // Generar rango de fechas
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        blockedDates.push(date.toISOString().split('T')[0]);
      }
    });

    // Eliminar duplicados (por si acaso)
    const uniqueBlockedDates = [...new Set(blockedDates)].sort();
    
    console.log('📅 Unique blocked dates:', uniqueBlockedDates.length);
    
    res.json({ 
      blockedDates: uniqueBlockedDates,
      count: uniqueBlockedDates.length 
    });

  } catch (error) {
    console.error('❌ Error getting blocked dates:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
};