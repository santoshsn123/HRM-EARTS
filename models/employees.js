"use strict";
module.exports = (sequelize, DataTypes) => {
  const Employees = sequelize.define(
    "Employees",
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      gender: DataTypes.STRING,
      formSubmitedStat: DataTypes.BOOLEAN,
      linkCode: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      isRegistered: DataTypes.BOOLEAN,
      password: DataTypes.STRING,
      salary: DataTypes.INTEGER
    },
    {}
  );
  Employees.associate = function(models) {
    // associations can be defined here
  };
  return Employees;
};
