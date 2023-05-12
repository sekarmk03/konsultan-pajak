'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConsultType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ConsultType.hasMany(models.Schedule, {foreignKey: 'type_id', as: 'schedules'});
    }
  }
  ConsultType.init({
    type: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ConsultType',
  });
  return ConsultType;
};