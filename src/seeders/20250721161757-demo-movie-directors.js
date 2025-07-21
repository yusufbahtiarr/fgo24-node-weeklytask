"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("movie_directors", [
      { movie_id: 1, director_id: 1 },
      { movie_id: 2, director_id: 2 },
      { movie_id: 3, director_id: 3 },
      { movie_id: 4, director_id: 4 },
      { movie_id: 5, director_id: 5 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("movie_directors", null, {});
  },
};
