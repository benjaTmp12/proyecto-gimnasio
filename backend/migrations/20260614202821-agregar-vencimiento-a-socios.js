'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Socios', 'fechaVencimiento', {
      type: Sequelize.DATEONLY,
      allowNull: true // Puede ser nulo si el socio recién se inscribe y aún no paga
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Socios', 'fechaVencimiento');
  }
};