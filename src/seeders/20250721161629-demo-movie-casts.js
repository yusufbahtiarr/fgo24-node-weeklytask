"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("movie_casts", [
      { movie_id: 1, cast_id: 1 },
      { movie_id: 1, cast_id: 2 },
      { movie_id: 2, cast_id: 2 },
      { movie_id: 2, cast_id: 3 },
      { movie_id: 3, cast_id: 3 },
      { movie_id: 3, cast_id: 4 },
      { movie_id: 4, cast_id: 4 },
      { movie_id: 4, cast_id: 5 },
      { movie_id: 5, cast_id: 5 },
      { movie_id: 5, cast_id: 2 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("movie_casts", null, {});
  },
};
