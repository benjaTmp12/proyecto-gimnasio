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
      Inscripcion.belongsTo(models.Socio, { foreignKey: 'socioId', as: 'socio' });
      Inscripcion.belongsTo(models.Clase, { foreignKey: 'claseId', as: 'clase' });
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