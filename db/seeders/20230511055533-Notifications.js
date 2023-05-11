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
   await queryInterface.bulkInsert('Notifications', [
    {
      receiver_id: 3,
      sender_id: 0,
      topic: "account",
      title: "Account Created!",
      message: "Welcome to KKP Budi Indratno. Dapatkan keuntungan dengan pelayanan oleh konsultan berpengalaman tinggi dan jaminan risiko perpajakan.",
      is_read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      receiver_id: 3,
      sender_id: 0,
      topic: "consultation",
      title: "Schedule requested!",
      message: "Permintaan jadwal anda berhasil. Silakan menunggu paling lambat sampai 5 hari kerja untuk proses verifikasi permintaan.",
      is_read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      receiver_id: 3,
      sender_id: 0,
      topic: "consultation",
      title: "Schedule accepted!",
      message: "Permintaan jadwal anda telah disetujui. Tim kami akan segera menghubungi anda melalui fitur layanan chat dalam 1 x 24 jam.",
      is_read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      receiver_id: 3,
      sender_id: 0,
      topic: "consultation",
      title: "Consultation is over!",
      message: "Konsultasi anda telah selesai. Dapatkan dokumen hasil konsultasi pada halaman riwayat konsultasi anda.",
      is_read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      receiver_id: 4,
      sender_id: 0,
      topic: "account",
      title: "Account Created!",
      message: "Welcome to KKP Budi Indratno. Dapatkan keuntungan dengan pelayanan oleh konsultan berpengalaman tinggi dan jaminan risiko perpajakan.",
      is_read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      receiver_id: 4,
      sender_id: 0,
      topic: "consultation",
      title: "Schedule requested!",
      message: "Permintaan jadwal anda berhasil. Silakan menunggu paling lambat sampai 5 hari kerja untuk proses verifikasi permintaan.",
      is_read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      receiver_id: 4,
      sender_id: 0,
      topic: "consultation",
      title: "Schedule accepted!",
      message: "Permintaan jadwal anda telah disetujui. Tim kami akan segera menghubungi anda melalui fitur layanan chat dalam 1 x 24 jam.",
      is_read: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      receiver_id: 4,
      sender_id: 0,
      topic: "consultation",
      title: "Consultation is over!",
      message: "Konsultasi anda telah selesai. Dapatkan dokumen hasil konsultasi pada halaman riwayat konsultasi anda.",
      is_read: false,
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
