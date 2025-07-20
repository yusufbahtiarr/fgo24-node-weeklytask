// models/cast.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cast extends Model {
    static associate(models) {
      Cast.belongsToMany(models.Movie, {
        through: "MovieCast",
        foreignKey: "cast_id",
        otherKey: "movie_id",
        as: "movies",
      });
    }
  }

  Cast.init(
    {
      cast_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
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
