'use strict';
const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const numStories = 50; //match to stories seeder
    const numUsers = 35; //match total users
    const comments = [];
    const numComments = 70;

    function getRandom(max) {
      return Math.floor(Math.random() * max) + 1;
    }

    for(let i =0; i<numComments; i++) {
      const createdAt = faker.date.past(0);
      const userId = getRandom(numUsers);
      const storyId = getRandom(numStories);
      comments.push({
        comment: `Comment on story '${storyId.toString(16)}' (${storyId}) by user '${userId}' with gibberish ${faker.random.words(getRandom(5) + 2)}`,
        storyId,
        userId,
        createdAt,
        updatedAt: faker.date.between(createdAt, new Date()),
      })
    }
    return queryInterface.bulkInsert('Comments', comments, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {});
  }
}
