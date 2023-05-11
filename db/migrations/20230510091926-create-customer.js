'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      img_id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      npwp: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      leader_name: {
        type: Sequelize.STRING
      },
      leader_title: {
        type: Sequelize.STRING
      },
      pkp: {
        type: Sequelize.STRING
      },
      business_type: {
        type: Sequelize.STRING
      },
      acc_name: {
        type: Sequelize.STRING
      },
      acc_telp: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Customers');
  }
};