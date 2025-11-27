"use strict";

import bcrypt from ("bcrypt");

// Se elimina la constante 'rentedUntil' ya que la disponibilidad se gestiona en la tabla Rentals.

export default {
  up: async (queryInterface, Sequelize) => {
    // 1. Encriptación de contraseñas (necesario para el login)
    const hashedPassword = await bcrypt.hash("password123", 10);

    // 2. Insertar Usuarios
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Admin User",
          email: "admin@test.com",
          password: hashedPassword, // Contraseña encriptada
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Basic User",
          email: "user@test.com",
          password: hashedPassword, // Contraseña encriptada
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // 3. Insertar Autos (Quitamos isRented y availableUntil)
    await queryInterface.bulkInsert(
      "Cars",
      [
        // Datos del CSV y la lista anterior
        {
          brand: "Porsche",
          model: "911 Carrera",
          price: "120000.00",
          imageUrl:
            "https://file.aiquickdraw.com/imgcompressed/img/compressed_5c1b005e48db37911413ea1bc4f8d276.webp",
          description: "Deportivo de alta gama, actualmente alquilado.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          brand: "Ford",
          model: "Mustang GT",
          price: "45000.50",
          imageUrl:
            "https://imgd.aeplcdn.com/664x374/cw/ec/23766/Ford-Mustang-Exterior-126883.jpg?wm=0&q=80",
          description: "Clásico muscle car, regresa pronto.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          brand: "Toyota",
          model: "Corolla",
          price: "22000.00",
          imageUrl:
            "https://fotos.perfil.com/2020/02/21/toyota-corolla-2020-llegaron-las-nuevas-versiones-918345.jpg",
          description: "Sedán confiable y popular.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          brand: "Chevrolet",
          model: "Cruze",
          price: "25000.00",
          imageUrl:
            "https://www.chevrolet.com.ar/content/dam/chevrolet/sa/argentina/espanol/index/cars/cruze-5-premier/colorizer-1/02-images-2021/colorizer-branco-summit.jpg?imwidth=960",
          description: "Excelente para viajes largos.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          brand: "Volkswagen",
          model: "Golf GTI",
          price: "32000.00",
          imageUrl:
            "https://www.pngplay.com/wp-content/uploads/13/Volkswagen-Golf-GTI-PNG-Photos.png",
          description: "Hatchback deportivo y ágil.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          brand: "Honda",
          model: "CR-V",
          price: "30500.00",
          imageUrl:
            "https://imgd.aeplcdn.com/664x374/cw/ec/23766/Honda-CRV-Exterior-126883.jpg?wm=0&q=80",
          description: "SUV compacto con gran espacio interior.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          brand: "Audi",
          model: "A4",
          price: "48900.00",
          imageUrl:
            "https://imgd.aeplcdn.com/664x374/cw/ec/23766/Audi-A4-Exterior-126883.jpg?wm=0&q=80",
          description: "Sedán de lujo con tracción total.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          brand: "Jeep",
          model: "Wrangler",
          price: "39999.99",
          imageUrl:
            "https://imgd.aeplcdn.com/664x374/cw/ec/23766/Jeep-Wrangler-Exterior-126883.jpg?wm=0&q=80",
          description: "Todoterreno icónico y resistente.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          brand: "Tesla",
          model: "Model 3",
          price: "55000.00",
          imageUrl:
            "https://imgd.aeplcdn.com/664x374/cw/ec/23766/Tesla-Model-3-Exterior-126883.jpg?wm=0&q=80",
          description: "Vehículo eléctrico con gran autonomía.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          brand: "Mazda",
          model: "MX-5 Miata",
          price: "28999.00",
          imageUrl:
            "https://imgd.aeplcdn.com/664x374/cw/ec/23766/Mazda-MX5-Exterior-126883.jpg?wm=0&q=80",
          description: "Roadster deportivo y divertido de conducir.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Lógica para deshacer la inserción
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Cars", null, {});
  },
};
