"use strict";

export default {
  async up(queryInterface, Sequelize) {
    // Primero crear la tabla Reservations (código anterior)
    await queryInterface.createTable("Reservations", {
      // ... mismo código de creación de tabla
    });

    // Agregar índices
    await queryInterface.addIndex("Reservations", ["userId"]);
    // ... otros índices

    // DATOS DE PRUEBA
    await queryInterface.bulkInsert(
      "Reservations",
      [
        {
          userId: 1,
          carId: 1,
          startDate: "2024-01-15",
          endDate: "2024-01-20",
          totalDays: 5,
          totalPrice: 250.0,
          status: "confirmed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          carId: 2,
          startDate: "2024-01-10",
          endDate: "2024-01-12",
          totalDays: 2,
          totalPrice: 120.0,
          status: "completed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    console.log("✅ Tabla Reservations creada con datos de prueba");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Reservations");
  },
};
