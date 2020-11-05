'use strict';
const faker = require('faker');
const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const users = [
      { username: "Mike", email: "mike@mike.com", hashedPassword: bcrypt.hashSync("Pas$w0rd", 10), createdAt: faker.date.past(3), updatedAt: new Date() },
      { username: "Scott", email: "scott@scott.com", hashedPassword: bcrypt.hashSync("Pas$w0rd", 10), createdAt: faker.date.past(3), updatedAt: new Date() },
      { username: "Dale", email: "dale@dale.com", hashedPassword: bcrypt.hashSync("Pas$w0rd", 10), createdAt: faker.date.past(3), updatedAt: new Date() },
      { username: "Rhys", email: "rhys@rhys.com", hashedPassword: bcrypt.hashSync("Pas$w0rd", 10), createdAt: faker.date.past(3), updatedAt: new Date() },
      { username: "Ian", email: "ian@ian.com", hashedPassword: bcrypt.hashSync("Pas$w0rd", 10), createdAt: faker.date.past(3), updatedAt: new Date() },
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
