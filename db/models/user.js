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
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Story, {foreignKey: 'userId'}),
    User.hasMany(models.Comment, {foreignKey: 'userId'}),
    User.hasMany(models.storyLike, {foreignKey: 'userId'})
  };
  return User;
};
