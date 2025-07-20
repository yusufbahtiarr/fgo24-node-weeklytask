"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MovieCast extends Model {
    static associate(models) {
      MovieCast.belongsTo(models.Movie, {
        foreignKey: "movie_id",
        as: "movie",
      });
      MovieCast.belongsTo(models.Cast, {
        foreignKey: "cast_id",
        as: "cast",
      });
    }
  }

  MovieCast.init(
    {
      movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      cast_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MovieCast",
      tableName: "movies_casts",
      timestamps: true,
      underscored: true,
    }
  );

  return MovieCast;
};
