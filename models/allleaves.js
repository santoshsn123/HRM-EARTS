'use strict';
module.exports = (sequelize, DataTypes) => {
  const AllLeaves = sequelize.define('AllLeaves', {
    leaveDate: DataTypes.DATE,
    reason: DataTypes.STRING
  }, {});
  AllLeaves.associate = function(models) {
    // associations can be defined here
  };
  return AllLeaves;
};