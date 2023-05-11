'use strict';
const pkp = require('../../common/constant/pkp');

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
   await queryInterface.bulkInsert('Customers', [
    {
      img_id: 3,
      name: "Sekar Madu",
      npwp: "08.178.554.2-123.321",
      address: "Gegerkalong Girang, Sukasari, Bandung",
      leader_name: "Leader 1",
      leader_title: "Kepala Bagian A",
      pkp: pkp.NO,
      business_type: "Penyediaan Akomodasi dan Penyediaan Makan Minum",
      acc_name: "Nama Akunting 1",
      acc_telp: "089123456789",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      img_id: 4,
      name: "Kusumawardani",
      npwp: "08.178.554.2-123.432",
      address: "Setiabudi, Bandung",
      leader_name: "Leader 2",
      leader_title: "Kepala Bagian B",
      pkp: pkp.YES,
      business_type: "Jasa Kesehatan dan Kegiatan Sosial",
      acc_name: "Nama Akunting 2",
      acc_telp: "089876543210",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      img_id: 5,
      name: "Muhammad Azar Nuzy",
      npwp: "09.178.554.2-123.432",
      address: "Sukajadi, Kota Bandung, Jawa Barat",
      leader_name: "Leader 3",
      leader_title: "Kepala Bagian C",
      pkp: pkp.YES,
      business_type: "Pertanian, Kehutanan dan Perikanan",
      acc_name: "Nama Akunting 3",
      acc_telp: "081234567890",
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
    await queryInterface.bulkDelete('Customers', null, {});
  }
};
