'use strict'
const User = require('../models').User
const UserRole = require('../models').UserRole
const Role = require('../models').Role

module.exports = {
  up: (queryInterface, Sequelize) => {
    
      // return queryInterface.bulkInsert('Users', [{
      //   username: 'root',
      //   password
      // }], {});

      let rootUser

      return User.create({username: 'root', password: 'root'})
        .then(user => {
          rootUser = user
          return Role.findAll()
        })
        .then(roles => {
          const userRoles = roles.map( role => { return {user_id: rootUser.id, role_id: role.id}})
          return UserRole.bulkCreate(userRoles)
        })
    
  },

  down: (queryInterface, Sequelize) => {
    return User.find({where:{username:'root'}})
      .then(user => {
        UserRole.destroy({where:{user_id: user.id}})
        User.destroy({where:{id: user.id}})
      })
  }
};
