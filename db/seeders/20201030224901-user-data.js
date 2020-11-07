'use strict';
const faker = require('faker');
const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const users = [
      { username: "Mike", email: "mike@mike.com", hashedPassword: bcrypt.hashSync("Pas$w0rd", 10), avatar: "", description: "Home page maker, can't login without him (you gotta 'Like' his likes, too)", createdAt: faker.date.past(3), updatedAt: new Date() },
      { username: "Scott", email: "scott@scott.com", hashedPassword: bcrypt.hashSync("Pas$w0rd", 10), avatar: "", description: "Story master; scrummer; seeder man, too", createdAt: faker.date.past(3), updatedAt: new Date() },
      { username: "Dale", email: "dale@dale.com", hashedPassword: bcrypt.hashSync("Pas$w0rd", 10), avatar: "", description: "All around helper, a real 'user' guide and 'follower' guy", createdAt: faker.date.past(3), updatedAt: new Date() },
      { username: "Rhys", email: "rhys@rhys.com", hashedPassword: bcrypt.hashSync("Pas$w0rd", 10), avatar: "", description: "'Comments'? Leave it to me!", createdAt: faker.date.past(3), updatedAt: new Date() },
      { username: "Ian", email: "ian@ian.com", hashedPassword: bcrypt.hashSync("Pas$w0rd", 10), avatar: "", description: "A an expert a/A instructor and motivator", createdAt: faker.date.past(3), updatedAt: new Date() },
    ];

    const extraUsers = 30;

    for(let i = 0; i < extraUsers; i++) {
      const createdAt = faker.date.past(3);
      const first = faker.name.firstName();
      const last = faker.name.lastName();
      users.push({
        username: faker.internet.userName(first, last),
        email: faker.internet.email(first, last),
        hashedPassword: bcrypt.hashSync(faker.internet.password(8, false, null, 'Ca!7'), 10),
        avatar: '',
        description: '',
        createdAt,
        updatedAt: faker.date.between(createdAt, faker.date.recent()),
      });
    }

    return queryInterface.bulkInsert('Users', users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
