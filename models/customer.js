'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.belongsTo(models.User, {foreignKey: 'user_id', as: 'user'});
    }
  }
  Customer.init({
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    npwp: DataTypes.STRING,
    address: DataTypes.STRING,
    leader_name: DataTypes.STRING,
    leader_title: DataTypes.STRING,
    pkp: DataTypes.STRING,
    business_type: DataTypes.STRING,
    acc_name: DataTypes.STRING,
    acc_telp: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customer',
  });
  return Customer;
};