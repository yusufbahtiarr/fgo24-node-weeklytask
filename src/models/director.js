"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Director extends Model {
    static associate(models) {
      Director.belongsToMany(models.Movie, {
        through: "MovieDirector",
        foreignKey: "director_id",
        otherKey: "movie_id",
        as: "movies",
      });
    }
  }
  Director.init(
    {
      director_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
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
