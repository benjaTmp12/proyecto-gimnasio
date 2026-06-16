'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuarios', 'rol', {
      type: Sequelize.ENUM('admin', 'empleado'),
      allowNull: false,
      defaultValue: 'empleado'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Usuarios', 'rol');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Usuarios_rol";');
  }
};
