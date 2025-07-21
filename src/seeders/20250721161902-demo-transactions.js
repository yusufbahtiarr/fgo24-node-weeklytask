"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("transactions", [
      {
        name: "Yusuf Bahtiar",
        email: "yusuf@mail.com",
        phone: "081234567890",
        total_amount: 75000,
        movie_date: new Date("2025-07-22"),
        movie_id: 1,
        cinema_id: 1,
        time_id: 1,
        location_id: 1,
        payment_method_id: 1,
        user_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Budi Santoso",
        email: "budi@mail.com",
        phone: "082345678901",
        total_amount: 120000,
        movie_date: new Date("2025-07-23"),
        movie_id: 2,
        cinema_id: 2,
        time_id: 2,
        location_id: 2,
        payment_method_id: 2,
        user_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Admin",
        email: "admin@mail.com",
        phone: "083456789012",
        total_amount: 100000,
        movie_date: new Date("2025-07-24"),
        movie_id: 3,
        cinema_id: 3,
        time_id: 3,
        location_id: 3,
        payment_method_id: 3,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("transactions", null, {});
  },
};
