"use strict";

const { hashPassword } = require("../utils/password"); // sesuaikan path-nya

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        email: "admin@mail.com",
        password: await hashPassword("admin123"),
        role: "admin",
        profile_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "yusuf@mail.com",
        password: await hashPassword("yusuf123"),
        role: "user",
        profile_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "budi@mail.com",
        password: await hashPassword("budi123"),
        role: "user",
        profile_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
