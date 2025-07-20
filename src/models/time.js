"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Time extends Model {
    static associate(models) {}
  }
  Time.init(
    {
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Time",
      tableName: "times",
      timestamps: true,
      underscored: true,
    }
  );
  return Time;
};
