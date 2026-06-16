'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {}
  }
  Usuario.init({
    nombre: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // ---> AGREGAMOS ESTO <---
    resetToken: DataTypes.STRING,
    resetTokenExpires: DataTypes.DATE,
    rol: {
      type: DataTypes.ENUM('admin', 'empleado'),
      allowNull: false,
      defaultValue: 'empleado'
    }
  }, {
    sequelize,
    modelName: 'Usuario',
  });
  return Usuario;
};