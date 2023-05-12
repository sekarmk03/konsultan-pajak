'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.hasOne(models.Consultation, {foreignKey: 'schedule_id', as: 'consultation'});
      Schedule.belongsTo(models.Customer, {foreignKey: 'cust_id', as: 'customer'});
      Schedule.belongsTo(models.ConsultType, {foreignKey: 'type_id', as: 'type'});
    }
  }
  Schedule.init({
    cust_id: DataTypes.INTEGER,
    type_id: DataTypes.INTEGER,
    date: DataTypes.DATE,
    place_type: DataTypes.STRING,
    address: DataTypes.STRING,
    gmap_link: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};