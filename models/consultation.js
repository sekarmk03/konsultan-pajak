'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Consultation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Consultation.belongsTo(models.Schedule, {foreignKey: 'schedule_id', as: 'schedule'});
      Consultation.belongsTo(models.Admin, {foreignKey: 'admin_id', as: 'admin'});
      Consultation.hasMany(models.Document, {foreignKey: 'consultation_id', as: 'documents'});
    }
  }
  Consultation.init({
    schedule_id: DataTypes.INTEGER,
    admin_id: DataTypes.INTEGER,
    date_start: DataTypes.DATE,
    date_end: DataTypes.DATE,
    status: DataTypes.STRING,
    cost: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Consultation',
  });
  return Consultation;
};