"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MovieGenre extends Model {
    static associate(models) {
      MovieGenre.belongsTo(models.Movie, {
        foreignKey: "movie_id",
        as: "movie",
      });
      MovieGenre.belongsTo(models.Genre, {
        foreignKey: "genre_id",
        as: "genre",
      });
    }
  }
  MovieGenre.init(
    {
      movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      genre_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MovieGenre",
      tableName: "movie_genres",
      timestamps: false,
      underscored: true,
    }
  );
  return MovieGenre;
};
