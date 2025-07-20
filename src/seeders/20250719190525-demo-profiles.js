"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Profiles", [
      {
        fullname: "Admin",
        phone: "082345234534",
        image_url: "8d34443a-8d42-40bb-b1df-6d260c6f9ec6.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: "Yusuf Bahtiar",
        phone: "08123456789",
        image_url: "4127c287-ff89-415d-8035-32437d92be0a.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: "Budi Santoso",
        phone: "08999234999",
        image_url: "dc917c7b-1e18-4001-85bf-f4d245557c00.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Profiles", null, {});
  },
};
