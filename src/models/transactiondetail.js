"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TransactionDetail extends Model {
    static associate(models) {
      TransactionDetail.belongsTo(models.Transaction, {
        foreignKey: "transaction_id",
        as: "transaction",
      });
    }
  }

  TransactionDetail.init(
    {
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      seat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TransactionDetail",
      tableName: "transaction_details",
      timestamps: true,
      underscored: true,
    }
  );

  return TransactionDetail;
};
