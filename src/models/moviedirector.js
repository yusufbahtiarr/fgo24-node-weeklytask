"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MovieDirector extends Model {
    static associate(models) {
      MovieDirector.belongsTo(models.Movie, {
        foreignKey: "movie_id",
        as: "movie",
      });

      MovieDirector.belongsTo(models.Director, {
        foreignKey: "director_id",
        as: "director",
      });
    }
  }

  MovieDirector.init(
    {
      movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      director_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MovieDirector",
      tableName: "movie_directors",
      timestamps: true,
      underscored: true,
    }
  );

  return MovieDirector;
};
