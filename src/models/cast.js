"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cast extends Model {
    static associate(models) {}
  }
  Cast.init(
    {
      cast_name: DataTypes.STRING,
      allowNull: false,
    },
    {
      sequelize,
      modelName: "Cast",
      tableName: "casts",
      timestamps: true,
      underscored: true,
    }
  );
  return Cast;
};
