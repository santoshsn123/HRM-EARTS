'use strict';
module.exports = (sequelize, DataTypes) => {
  const SubTimings = sequelize.define('SubTimings', {
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    userId: DataTypes.INTEGER,
    mainId: DataTypes.INTEGER,
    completedStatus: DataTypes.BOOLEAN
  }, {});
  SubTimings.associate = function(models) {
    // associations can be defined here
  };
  return SubTimings;
};