'use strict';
const place = require('../../common/constant/placeType');
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
   await queryInterface.bulkInsert('Schedules', [
    {
      cust_id: 3,
      type_id: 1,
      date: "2023-01-07 11:00:00",
      place_type: place.OFFICE,
      address: "Margahayu Raya, Kota Bandung, Jawa Barat",
      gmap_link: "https://goo.gl/maps/W4U6iQGhUsbXSKWu8",
      status: status.DONE,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cust_id: 3,
      type_id: 1,
      date: "2023-01-07 12:30:00",
      place_type: place.OFFICE,
      address: "Margahayu Raya, Kota Bandung, Jawa Barat",
      gmap_link: "https://goo.gl/maps/W4U6iQGhUsbXSKWu8",
      status: status.DECLINED,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cust_id: 3,
      type_id: 1,
      date: new Date(),
      place_type: place.OFFICE,
      address: "Margahayu Raya, Kota Bandung, Jawa Barat",
      gmap_link: "https://goo.gl/maps/W4U6iQGhUsbXSKWu8",
      status: status.ACCEPTED,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cust_id: 4,
      type_id: 1,
      date: new Date(),
      place_type: place.OFFICE,
      address: "Gegerkalong Girang, Setiabudi, Jawa Barat",
      gmap_link: "https://goo.gl/maps/W4U6iQGhUsbXSKWu8",
      status: status.REQUESTED,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      cust_id: 5,
      type_id: 1,
      date: new Date(),
      place_type: place.OFFICE,
      address: "Sukajadi Raya, Bandung, Jawa Barat",
      gmap_link: "https://goo.gl/maps/W4U6iQGhUsbXSKWu8",
      status: status.REQUESTED,
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
  }
};
