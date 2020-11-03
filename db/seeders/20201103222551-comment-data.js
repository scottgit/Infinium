'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Comments', [
      {
        comment: 'Interesting story you have here',
        storyId: 3, 
        userId: 3, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: 'I love this story!!',
        storyId: 3, 
        userId: 5, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: 'This story was kind of boring...',
        storyId: 4, 
        userId: 4, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        comment: 'I wish you had included images.',
        storyId: 4, 
        userId: 1, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {});
  }
};
