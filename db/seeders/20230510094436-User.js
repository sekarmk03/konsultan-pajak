'use strict';
const bcrypt = require('bcrypt');
const roles = require('../../common/constant/roles');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Users', [
    {
      email: "sekarmadu99@gmail.com",
      password: await bcrypt.hash('secret123', 10),
      role_id: roles.SUPERADMIN,
      user_detail_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: "sekarmadu@upi.edu",
      password: await bcrypt.hash('secret123', 10),
      role_id: roles.ADMIN,
      user_detail_id: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: "sekarmadukusumawardani@gmail.com",
      password: await bcrypt.hash('secret123', 10),
      role_id: roles.CUSTOMER,
      user_detail_id: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: "sekar.kusumawardani@digits.id",
      password: await bcrypt.hash('secret123', 10),
      role_id: roles.CUSTOMER,
      user_detail_id: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      email: "azarnuzy@gmail.com",
      password: await bcrypt.hash('secret123', 10),
      role_id: roles.CUSTOMER,
      user_detail_id: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },
   ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  }
};
