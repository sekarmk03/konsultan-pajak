'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.Customer, {foreignKey: 'receiver_id', as: 'receiver'});
      Notification.belongsTo(models.Admin, {foreignKey: 'sender_id', as: 'sender'});
    }
  }
  Notification.init({
    receiver_id: DataTypes.INTEGER,
    sender_id: DataTypes.INTEGER,
    topic: DataTypes.STRING,
    title: DataTypes.STRING,
    message: DataTypes.STRING,
    is_read: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};