'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Entrenador extends Model {
    static associate(models) {
      Entrenador.hasMany(models.Clase, { foreignKey: 'entrenadorId', as: 'clases' });
    }
  }
  Entrenador.init({
    nombre: { type: DataTypes.STRING, allowNull: false },
    telefono: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    especialidad: { type: DataTypes.STRING, allowNull: true },
    estado: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Activo' },
    horarios: {
      type: DataTypes.JSON,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Entrenador',
    tableName: 'Entrenadores'
  });
  return Entrenador;
};
