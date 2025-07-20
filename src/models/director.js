"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Director extends Model {
    static associate(models) {}
  }
  Director.init(
    {
      director_name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Director",
      tableName: "directors",
      timestamps: true,
      underscored: true,
    }
  );
  return Director;
};
