"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("casts", [
      {
        cast_name: "Tom Holland",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        cast_name: "Zendaya",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        cast_name: "Robert Downey Jr.",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        cast_name: "Scarlett Johansson",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        cast_name: "Chris Hemsworth",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("casts", null, {});
  },
};
