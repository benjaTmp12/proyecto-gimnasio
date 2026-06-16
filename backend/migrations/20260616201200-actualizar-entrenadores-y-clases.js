'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Agregar columnas a Entrenadores
    await queryInterface.addColumn('Entrenadores', 'telefono', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Entrenadores', 'email', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Entrenadores', 'estado', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Activo'
    });

    // 2. Agregar columnas a Clases
    await queryInterface.addColumn('Clases', 'entrenadorId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Nullable to prevent crashing on existing data
      references: {
        model: 'Entrenadores',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.addColumn('Clases', 'horaInicio', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Clases', 'horaFin', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Clases', 'dias', {
      type: Sequelize.JSON,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Remover columnas en reversa
    await queryInterface.removeColumn('Clases', 'dias');
    await queryInterface.removeColumn('Clases', 'horaFin');
    await queryInterface.removeColumn('Clases', 'horaInicio');
    await queryInterface.removeColumn('Clases', 'entrenadorId');
    await queryInterface.removeColumn('Entrenadores', 'estado');
    await queryInterface.removeColumn('Entrenadores', 'email');
    await queryInterface.removeColumn('Entrenadores', 'telefono');
  }
};
