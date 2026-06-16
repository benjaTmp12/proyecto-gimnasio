'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Entrenadores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      especialidad: {
        type: Sequelize.STRING,
        allowNull: true
      },
      horarios: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array de objetos { dia: "Lunes", horas: ["07:00", "09:00"] }'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Entrenadores');
  }
};
