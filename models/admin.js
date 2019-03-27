"use strict";
module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      adminName: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      forgetPassword: DataTypes.STRING
    },
    {}
  );
  Admin.associate = function(models) {
    // associations can be defined here
  };
  return Admin;
};
