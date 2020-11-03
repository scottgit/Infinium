'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Stories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      draft: {
        type: Sequelize.TEXT
      },
      published: {
        type: Sequelize.TEXT
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      subtitle: {
        type: Sequelize.STRING(100)
      },
      imageLink: {
        type: Sequelize.STRING(255)
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model: Users}
      },
      publishAfter: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Stories');
  }
};
