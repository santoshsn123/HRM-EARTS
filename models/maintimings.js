'use strict';
module.exports = (sequelize, DataTypes) => {
  const MainTimings = sequelize.define('MainTimings', {
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    completedStatus: DataTypes.BOOLEAN
  }, {});
  MainTimings.associate = function(models) {
    // associations can be defined here
  };
  return MainTimings;
};