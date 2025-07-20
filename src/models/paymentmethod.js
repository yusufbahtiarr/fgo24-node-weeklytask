"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PaymentMethod extends Model {
    static associate(models) {}
  }
  PaymentMethod.init(
    {
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PaymentMethod",
      tableName: "payment_methods",
      timestamps: true,
      underscored: true,
    }
  );
  return PaymentMethod;
};
