'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Image.hasOne(models.User, {foreignKey: 'img_id', as: 'user'});
    }
  }
  Image.init({
    file_name: DataTypes.STRING,
    imagekit_id: DataTypes.STRING,
    imagekit_url: DataTypes.STRING,
    imagekit_path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};