'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      { username: "Mike", email: "mike@mike.com", hashedPassword: "password", createdAt: new Date(), updatedAt: new Date() },
      { username: "Scott", email: "scott@scott.com", hashedPassword: "password", createdAt: new Date(), updatedAt: new Date() },
      { username: "Dale", email: "dale@dale.com", hashedPassword: "password", createdAt: new Date(), updatedAt: new Date() },
      { username: "Rhys", email: "rhys@rhys.com", hashedPassword: "password", createdAt: new Date(), updatedAt: new Date() },
      { username: "Ian", email: "ian@ian.com", hashedPassword: "password", createdAt: new Date(), updatedAt: new Date() },
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
