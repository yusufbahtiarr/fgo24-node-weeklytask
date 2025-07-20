"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      Movie.belongsToMany(models.Cast, {
        through: models.MovieCast,
        foreignKey: "movie_id",
        otherKey: "cast_id",
        as: "casts",
      });

      Movie.belongsToMany(models.Genre, {
        through: models.MovieGenre,
        foreignKey: "movie_id",
        otherKey: "genre_id",
        as: "genres",
      });

      Movie.belongsToMany(models.Director, {
        through: models.MovieDirector,
        foreignKey: "movie_id",
        otherKey: "director_id",
        as: "directors",
      });

      Movie.hasMany(models.Transaction, {
        foreignKey: "movie_id",
        as: "transactions",
      });
    }
  }
  Movie.init(
    {
      poster_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      backdrop_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      release_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      runtime: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      overview: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Movie",
      tableName: "movies",
      timestamps: true,
      underscored: true,
    }
  );
  return Movie;
};
