"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Genre extends Model {
    static associate(models) {
      Genre.belongsToMany(models.Movie, {
        through: "movie_genres",
        foreignKey: "genre_id",
        otherKey: "movie_id",
        as: "movies",
      });
    }
  }

  Genre.init(
    {
      genre_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
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
