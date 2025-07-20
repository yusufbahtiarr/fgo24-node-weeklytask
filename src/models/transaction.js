"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Movie, {
        foreignKey: "movie_id",
        as: "movie",
      });
      Transaction.belongsTo(models.Profile, {
        foreignKey: "user_id",
        as: "user",
      });
      Transaction.belongsTo(models.Cinema, {
        foreignKey: "cinema_id",
        as: "cinema",
      });
      Transaction.belongsTo(models.Time, {
        foreignKey: "time_id",
        as: "time",
      });
      Transaction.belongsTo(models.Location, {
        foreignKey: "location_id",
        as: "location",
      });
      Transaction.belongsTo(models.PaymentMethod, {
        foreignKey: "payment_method_id",
        as: "payment_method",
      });
      Transaction.hasMany(models.TransactionDetail, {
        foreignKey: "transaction_id",
        as: "transaction_detail",
      });
    }
  }

  Transaction.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_amount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      movie_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      cinema_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      time_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_method_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
      timestamps: true,
      underscored: true,
    }
  );

  return Transaction;
};
