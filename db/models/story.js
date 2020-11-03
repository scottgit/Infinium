'use strict';
module.exports = (sequelize, DataTypes) => {
  const Story = sequelize.define('Story', {
    draft: DataTypes.TEXT,
    published: DataTypes.TEXT,
    title: DataTypes.STRING,
    subtitle: DataTypes.STRING,
    imageLink: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    publishAfter: DataTypes.DATE
  }, {});
  Story.associate = function(models) {
    Story.belongsTo(models.User, {foreignKey: 'userId'}),
    Story.hasMany(models.Comment, {foreignKey: 'storyId'})
  };
  return Story;
};
