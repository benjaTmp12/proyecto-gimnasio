'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Clase extends Model {
    static associate(models) {
      Clase.belongsTo(models.Entrenador, { foreignKey: 'entrenadorId', as: 'entrenador' });
      Clase.hasMany(models.Inscripcion, { foreignKey: 'claseId', as: 'inscripciones' });
    }
  }
  Clase.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    instructor: { type: DataTypes.STRING, allowNull: true }, // Keep for compatibility/caching
    horario: { type: DataTypes.STRING, allowNull: true }, // Keep for compatibility/caching
    entrenadorId: { type: DataTypes.INTEGER, allowNull: false },
    horaInicio: { type: DataTypes.STRING, allowNull: false },
    horaFin: { type: DataTypes.STRING, allowNull: false },
    dias: { type: DataTypes.JSON, allowNull: false },
    cupos: { type: DataTypes.INTEGER, allowNull: false },
    capacidadMax: { type: DataTypes.INTEGER, defaultValue: 20 }
  }, {
    sequelize,
    modelName: 'Clase',
  });
  return Clase;
};