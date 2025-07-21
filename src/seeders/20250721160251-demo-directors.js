"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("directors", [
      {
        director_name: "Christopher Nolan",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        director_name: "Steven Spielberg",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        director_name: "James Cameron",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        director_name: "Quentin Tarantino",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        director_name: "Martin Scorsese",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        director_name: "Greta Gerwig",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        director_name: "Taika Waititi",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("directors", null, {});
  },
};
