"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("transaction_details", [
      {
        transaction_id: 1,
        seat: "A1",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        transaction_id: 1,
        seat: "A2",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        transaction_id: 2,
        seat: "B3",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        transaction_id: 2,
        seat: "B4",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        transaction_id: 3,
        seat: "C5",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("transaction_details", null, {});
  },
};
