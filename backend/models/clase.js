'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Clase.hasMany(models.Inscripcion, { foreignKey: 'claseId', as: 'inscripciones' });
    }
  }
  Clase.init({
    nombre: DataTypes.STRING,
    instructor: DataTypes.STRING,
    horario: DataTypes.STRING,
    cupos: DataTypes.INTEGER,
    capacidadMax: { type: DataTypes.INTEGER, defaultValue: 20 }
  }, {
    sequelize,
    modelName: 'Clase',
  });
  return Clase;
};