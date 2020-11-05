'use strict';
const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
      const stories = [];
      const number = 50;
      const users = 20;

      for(let i=0; i<number; i++) {
        const userId = Math.floor(Math.random() * users) + 1;
        const subtitle = Math.floor(Math.random() * 10) < 5 ? null : `Subtitle to this story (${i+1})`;
        const published = `This ${i+1} story is totally gibberish from here ${faker.random.words(100 + Math.floor(Math.random() * 300))}`;
        const createdAt = faker.date.past(2);
        const updatedAt = faker.date.between(createdAt, faker.date.recent());

        stories.push(
          {
            title: `Title of story '${(i+1).toString(16)}' (${i+1}) and gibberish ${faker.random.words(Math.floor(Math.random() * 5) + 1)}`,
            subtitle,
            draft: '',
            published,
            publishAfter: null,
            imageLink: `${faker.image.imageUrl()}/any`,
            userId,
            createdAt,
            updatedAt,
          }
        );
      }

      return queryInterface.bulkInsert('Stories', stories, {});

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Stories', null, {});
  }
};
