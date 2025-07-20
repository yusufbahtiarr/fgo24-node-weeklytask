"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {}
  }
  Genre.init(
    {
      genre_name: DataTypes.STRING,
      allowNull: false,
    },
    {
      sequelize,
      modelName: "Genre",
      tableName: "genres",
      timestamps: true,
      underscored: true,
    }
  );
  return Genre;
};
