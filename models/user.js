'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, {foreignKey: 'role_id', as: 'role'});
      User.hasOne(models.Admin, {foreignKey: 'user_id', as: 'admin'});
      User.hasOne(models.Customer, {foreignKey: 'user_id', as: 'customer'});
      User.belongsTo(models.Image, {foreignKey: 'img_id', as: 'image'});
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    img_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};