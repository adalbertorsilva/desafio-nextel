'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [{
      name: 'Standard',
      created_at: new Date(),
      updated_at: new Date()
    },{
      name: 'Admin',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
    
  },

  down: (queryInterface, Sequelize) => {

    queryInterface.delete('Roles', {name: 'Standard'}, {});
    return queryInterface.delete('Roles', {name: 'Admin'}, {});
  }
};
