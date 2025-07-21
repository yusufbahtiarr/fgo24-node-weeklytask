"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("cinemas", [
      {
        cinema_name: "Hiflix",
        image_url: "hiflix.png",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        cinema_name: "EBV",
        image_url: "ebv.png",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        cinema_name: "XXI",
        image_url: "xxi.png",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        cinema_name: "CGV",
        image_url: "cgv.png",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("cinemas", null, {});
  },
};
