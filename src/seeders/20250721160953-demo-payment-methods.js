"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("payment_methods", [
      {
        payment_method: "BCA",
        image_url: "bca.png",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        payment_method: "BRI",
        image_url: "bri.png",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        payment_method: "OVO",
        image_url: "ovo.png",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        payment_method: "DANA",
        image_url: "dana.png",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        payment_method: "GoPay",
        image_url: "gopay.png",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("payment_methods", null, {});
  },
};
