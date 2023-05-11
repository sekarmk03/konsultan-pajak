'use strict';
const gender = require('../../common/constant/gender');

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
   await queryInterface.bulkInsert('Admins', [
    {
      user_id: 1,
      name: "Sekar Madu Kusumawardani",
      age: 20,
      telp: "089691798633",
      gender: gender.FEMALE,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      user_id: 2,
      name: "Sekar Madu",
      age: 21,
      telp: "089691798633",
      gender: gender.MALE,
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
    await queryInterface.bulkDelete('Admins', null, {});
  }
};
