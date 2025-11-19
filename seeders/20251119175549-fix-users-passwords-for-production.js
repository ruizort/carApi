'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    // 1. Generar el hash
    const hashedPassword = await bcrypt.hash('password123', 10);

  
    await queryInterface.bulkDelete('Users', {
        email: ['admin@test.com', 'user@test.com']
    }, {});

   
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
  },

  down: async (queryInterface, Sequelize) => {
    // Si quisieras deshacer este cambio específico
    await queryInterface.bulkDelete('Users', {
        email: ['admin@test.com', 'user@test.com']
    }, {});
  }
};