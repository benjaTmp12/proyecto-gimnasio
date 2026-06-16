'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Socios', 'membresiaId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Membresia',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Socios', 'membresiaId');
  }
};
