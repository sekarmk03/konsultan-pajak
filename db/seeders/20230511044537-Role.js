'use strict';

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
   await queryInterface.bulkInsert('Roles', [
    {
      name: "Super Admin",
      desc: "This role has access to all resources",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Admin",
      desc: "This role has access to customer resources",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Customer",
      desc: "This role has access to customer features only",
      createdAt: new Date(),
      updatedAt: new Date()
    }
   ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
