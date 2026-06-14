'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Inscripcion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Inscripcion.init({
    socioId: DataTypes.INTEGER,
    claseId: DataTypes.INTEGER,
    fecha: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Inscripcion',
  });
  return Inscripcion;
};