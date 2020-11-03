'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('Stories', [
        {
          title: 'My non-titled draft',
          subtitle: '',
          draft: 'My non-titled draft',
          published: '',
          publishAfter: null,
          imageLink: '',
          userId: 1,
          createdAt: new Date('2018-04-15T08:16:00.000Z'),
          updatedAt: new Date('2018-04-15T10:05:00.000Z'),
        },
        {
          title: 'My titled draft',
          subtitle: '',
          draft: 'Here is the draft of this titled story, waiting to be published to the world.',
          published: '',
          publishAfter: null,
          imageLink: '',
          userId: 2,
          createdAt: new Date('2019-11-08T08:16:00.000Z'),
          updatedAt: new Date('2019-12-10T10:05:00.000Z'),
        },
        {
          title: 'My titled published story',
          subtitle: 'With subtitle',
          draft: '',
          published: 'Here is a published story that had a title set on it.',
          publishAfter: null,
          imageLink: '',
          userId: 2,
          createdAt: new Date('2020-01-08T08:16:00.000Z'),
          updatedAt: new Date('2020-01-15T10:05:00.000Z'),
        },
        {
          title: 'My untitled published story uses about first 100 characters as a title, so better set a title...',
          subtitle: '',
          draft: '',
          published: 'My untitled published story uses about first 100 characters as a title, so better set a title than to have it set for you as part of the story. That doesn\'t look good',
          publishAfter: null,
          imageLink: '',
          userId: 2,
          createdAt: new Date('2020-02-30T08:16:00.000Z'),
          updatedAt: new Date('2020-02-30T10:05:00.000Z'),
        },
      ], {});

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Stories', null, {});
  }
};
