"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cinema extends Model {
    static associate(models) {}
  }
  Cinema.init(
    {
      cinema_name: DataTypes.STRING,
      image_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Cinema",
      tableName: "cinemas",
      timestamps: true,
      underscored: true,
    }
  );
  return Cinema;
};
