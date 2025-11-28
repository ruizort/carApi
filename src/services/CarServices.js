class CarServices {
  checkCarAvailability = async (carId) => {
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
}

export default CarServices;
