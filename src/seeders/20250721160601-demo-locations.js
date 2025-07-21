"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("locations", [
      {
        location: "Jakarta",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        location: "Bogor",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        location: "Depok",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        location: "Tangerang",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        location: "Bekasi",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("locations", null, {});
  },
};
