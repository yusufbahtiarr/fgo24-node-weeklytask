"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("genres", [
      {
        genre_name: "Action",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        genre_name: "Adventure",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        genre_name: "Comedy",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        genre_name: "Drama",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        genre_name: "Sci-Fi",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        genre_name: "Horror",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        genre_name: "Romance",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("genres", null, {});
  },
};
