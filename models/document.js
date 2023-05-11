'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Document.init({
    file_name: DataTypes.STRING,
    imagekit_id: DataTypes.STRING,
    imagekit_url: DataTypes.STRING,
    imagekit_path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Document',
  });
  return Document;
};