"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("times", [
      {
        time: "13:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        time: "15:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        time: "17:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        time: "19:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        time: "21:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("times", null, {});
  },
};
