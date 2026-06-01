'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Socio extends Model {
    
    static associate(models) {
    }
  }
  Socio.init({
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    rut: DataTypes.STRING,
    email: DataTypes.STRING,
    telefono: DataTypes.STRING,
    estado: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Socio',
  });
  return Socio;
};