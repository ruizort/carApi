'use strict';

const bcrypt = require('bcrypt');

// Fecha de disponibilidad para los autos rentados (ej: 7 días en el futuro)
const rentedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); 

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    const hashedPassword = await bcrypt.hash('password123', 10);
   
    await queryInterface.bulkInsert('Users', [{
      name: 'Admin User',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Basic User',
      email: 'user@test.com',
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});  

    // 
    await queryInterface.bulkInsert('Cars', [
      
      { 
        brand: 'Porsche', 
        model: '911 Carrera', 
        price: 120000.00, 
        description: 'Deportivo de alta gama, actualmente alquilado.',
        isRented: true,
        availableUntil: rentedUntil, // Disponible en una semana
        createdAt: new Date(), updatedAt: new Date() 
      },
      { 
        brand: 'Ford', 
        model: 'Mustang GT', 
        price: 45000.50, 
        description: 'Clásico muscle car, regresa pronto.',
        isRented: true,
        availableUntil: rentedUntil, // Disponible en una semana
        createdAt: new Date(), updatedAt: new Date() 
      },
      
      // --- AUTOS DISPONIBLES (isRented: false, 8 Autos) ---
      { 
        brand: 'Toyota', 
        model: 'Corolla', 
        price: 22000.00, 
        description: 'Sedán confiable y popular.',
        isRented: false,
        availableUntil: null, 
        createdAt: new Date(), updatedAt: new Date() 
      },
      { 
        brand: 'Chevrolet', 
        model: 'Cruze', 
        price: 25000.00, 
        description: 'Excelente para viajes largos.',
        isRented: false,
        availableUntil: null, 
        createdAt: new Date(), updatedAt: new Date() 
      },
      { 
        brand: 'Volkswagen', 
        model: 'Golf GTI', 
        price: 32000.00, 
        description: 'Hatchback deportivo y ágil.',
        isRented: false,
        availableUntil: null, 
        createdAt: new Date(), updatedAt: new Date() 
      },
      { 
        brand: 'Honda', 
        model: 'CR-V', 
        price: 30500.00, 
        description: 'SUV compacto con gran espacio interior.',
        isRented: false,
        availableUntil: null, 
        createdAt: new Date(), updatedAt: new Date() 
      },
      { 
        brand: 'Audi', 
        model: 'A4', 
        price: 48900.00, 
        description: 'Sedán de lujo con tracción total.',
        isRented: false,
        availableUntil: null, 
        createdAt: new Date(), updatedAt: new Date() 
      },
      { 
        brand: 'Jeep', 
        model: 'Wrangler', 
        price: 39999.99, 
        description: 'Todoterreno icónico y resistente.',
        isRented: false,
        availableUntil: null, 
        createdAt: new Date(), updatedAt: new Date() 
      },
      { 
        brand: 'Tesla', 
        model: 'Model 3', 
        price: 55000.00, 
        description: 'Vehículo eléctrico con gran autonomía.',
        isRented: false,
        availableUntil: null, 
        createdAt: new Date(), updatedAt: new Date() 
      },
      { 
        brand: 'Mazda', 
        model: 'MX-5 Miata', 
        price: 28999.00, 
        description: 'Roadster deportivo y divertido de conducir.',
        isRented: false,
        availableUntil: null, 
        createdAt: new Date(), updatedAt: new Date() 
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Lógica para deshacer la inserción
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Cars', null, {});
  }
};