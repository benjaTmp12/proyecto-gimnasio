'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Entrenador extends Model {
    static associate(models) {
      // Entrenador tiene muchas clases
    }
  }
  Entrenador.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    especialidad: { type: DataTypes.STRING, allowNull: true },
    horarios: {
      type: DataTypes.JSON,
      allowNull: true,
      // Formato: [{ dia: "Lunes", horas: ["07:00", "09:00"] }, ...]
    }
  }, {
    sequelize,
    modelName: 'Entrenador',
    tableName: 'Entrenadores'
  });
  return Entrenador;
};
