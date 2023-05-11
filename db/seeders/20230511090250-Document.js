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
   await queryInterface.bulkInsert('Documents', [
    {
      file_name: 'sample.pdf',
      imagekit_id: 'sample-pdf',
      imagekit_url: 'https://ik.imagekit.io/sekarmadu/konsultan_pajak/sample.pdf',
      imagekit_path: '/konsultan_pajak/sample.pdf',
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
    await queryInterface.bulkDelete('Documents', null, {});
  }
};
