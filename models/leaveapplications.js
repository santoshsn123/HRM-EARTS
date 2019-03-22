'use strict';
module.exports = (sequelize, DataTypes) => {
  const LeaveApplications = sequelize.define('LeaveApplications', {
    leaveDate: DataTypes.DATE,
    reason: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    replyText: DataTypes.STRING
  }, {});
  LeaveApplications.associate = function(models) {
    // associations can be defined here
  };
  return LeaveApplications;
};