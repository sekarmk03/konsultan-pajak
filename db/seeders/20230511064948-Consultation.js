'use strict';
const status = require('../../common/constant/status');

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
   await queryInterface.bulkInsert('Consultations', [
    {
      schedule_id: 3,
      admin_id: 1,
      date_start: null,
      date_end: null,
      doc_id: 1,
      status: status.NOT_STARTED,
      cost: 1000000,
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
    await queryInterface.bulkDelete('Consultations', null, {});
  }
};
