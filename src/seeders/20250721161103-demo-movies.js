"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("movies", [
      {
        poster_url: "https://example.com/posters/inception.jpg",
        backdrop_url: "https://example.com/backdrops/inception.jpg",
        title: "Inception",
        release_date: new Date("2010-07-16"),
        runtime: 148,
        overview:
          "A skilled thief is given a chance at redemption if he can successfully perform inception—implanting an idea into a target's subconscious.",
        rating: 8.8,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        poster_url: "https://example.com/posters/interstellar.jpg",
        backdrop_url: "https://example.com/backdrops/interstellar.jpg",
        title: "Interstellar",
        release_date: new Date("2014-11-07"),
        runtime: 169,
        overview:
          "A group of astronauts travel through a wormhole in search of a new home for humanity as Earth nears its end.",
        rating: 8.6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        poster_url: "https://example.com/posters/dark-knight.jpg",
        backdrop_url: "https://example.com/backdrops/dark-knight.jpg",
        title: "The Dark Knight",
        release_date: new Date("2008-07-18"),
        runtime: 152,
        overview:
          "Batman faces his toughest challenge when the Joker unleashes chaos in Gotham City.",
        rating: 9.0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        poster_url: "https://example.com/posters/avatar.jpg",
        backdrop_url: "https://example.com/backdrops/avatar.jpg",
        title: "Avatar",
        release_date: new Date("2009-12-18"),
        runtime: 162,
        overview:
          "On the lush alien world of Pandora, a reluctant hero embarks on an epic journey of redemption and discovery.",
        rating: 7.9,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        poster_url: "https://example.com/posters/avengers-endgame.jpg",
        backdrop_url: "https://example.com/backdrops/avengers-endgame.jpg",
        title: "Avengers: Endgame",
        release_date: new Date("2019-04-26"),
        runtime: 181,
        overview:
          "The Avengers assemble once more to undo the damage caused by Thanos and restore balance to the universe.",
        rating: 8.4,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("movies", null, {});
  },
};
