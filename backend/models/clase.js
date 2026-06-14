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
      // define association here
    }
  }
  Clase.init({
    nombre: DataTypes.STRING,
    instructor: DataTypes.STRING,
    horario: DataTypes.STRING,
    cupos: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Clase',
  });
  return Clase;
};