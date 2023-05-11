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
   await queryInterface.bulkInsert('ConsultTypes', [
    {
      type: "Penyusunan Manual Pajak Perusahaan",
      desc: "Membantu klien perusahaan menyusun pedoman perpajakan yang berisi kebijakan, strategi, prosedur, pelaporan, dan petunjuk teknis perhitungan pajak.",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: "Penyusunan Transfer Pricing Documentation",
      desc: "Memberikan masukan pada dokumen dan strategi yang diperlukan untuk mencegah kerugian dari transaksi pihak terkait dan skenario transfer pricing.",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: "Penyusunan Asistensi Pajak",
      desc: "Membantu klien perusahaan dalam asistensi pemeriksaan pajak, keberatan pajak, banding pajak, kepatuhan/compliance pajak, dan jasa advisory pajak.",
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
    await queryInterface.bulkDelete('ConsultTypes', null, {});
  }
};
