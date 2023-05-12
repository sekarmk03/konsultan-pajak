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
      User.hasOne(models.Admin, {foreignKey: 'user_id', as: 'cust_detail'});
      User.hasOne(models.Customer, {foreignKey: 'user_id', as: 'adm_detail'});
      User.hasMany(models.Image, {foreignKey: 'user_id', as: 'images'});
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};