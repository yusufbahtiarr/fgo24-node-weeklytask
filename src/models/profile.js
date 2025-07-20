"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      Profile.hasOne(models.User, {
        foreignKey: "profile_id",
        as: "user",
      });
    }
  }

  Profile.init(
    {
      fullname: DataTypes.STRING,
      phone: DataTypes.STRING,
      image_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Profile",
      tableName: "profiles",
      timestamps: true,
      underscored: true,
    }
  );

  return Profile;
};
