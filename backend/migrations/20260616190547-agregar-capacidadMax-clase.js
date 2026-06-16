'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Clases', 'capacidadMax', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 20
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Clases', 'capacidadMax');
  }
};
