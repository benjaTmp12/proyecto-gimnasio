'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membresia extends Model {
    static associate(models) {
      Membresia.hasMany(models.Socio, { foreignKey: 'membresiaId', as: 'socios' });
    }
  }
  Membresia.init({
    tipo: DataTypes.STRING,
    precio: DataTypes.INTEGER,
    duracionDias: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Membresia',
    tableName: 'Membresia', 
    freezeTableName: true   
  });
  return Membresia;
};