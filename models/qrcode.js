'use strict';
module.exports = (sequelize, DataTypes) => {
  const QRCode = sequelize.define('QRCode', {
    punchin: DataTypes.STRING,
    punchout: DataTypes.STRING,
    activeStatus: DataTypes.BOOLEAN
  }, {});
  QRCode.associate = function(models) {
    // associations can be defined here
  };
  return QRCode;
};