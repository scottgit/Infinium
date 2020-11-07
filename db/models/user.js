'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      allowNull: false,
      type: DataTypes.STRING(50),
      unique: true
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING(50),
      unique: true
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING(255),
    },
    description: {
      type: DataTypes.STRING(255),
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Story, {foreignKey: 'userId'}),
    User.hasMany(models.Comment, {foreignKey: 'userId'})
  };
  return User;
};
