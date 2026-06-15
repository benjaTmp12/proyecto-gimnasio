'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Socio extends Model {
    static associate(models) {
    }
  }
  Socio.init({
    rut: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    fechaVencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    plan_nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    plan_precio: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Socio',
  });
  return Socio;
};