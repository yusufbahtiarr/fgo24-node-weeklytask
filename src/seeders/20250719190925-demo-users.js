"use strict";

const { hashPassword } = require("../utils/password"); // sesuaikan path-nya

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        email: "admin@mail.com",
        password: await hashPassword("admin123"),
        roles: "admin",
        profile_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "yusuf@mail.com",
        password: await hashPassword("yusuf123"),
        roles: "user",
        profile_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "budi@mail.com",
        password: await hashPassword("budi123"),
        roles: "user",
        profile_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
