'use strict'
const {Model, DataTypes} = require('sequelize')
const bcrypt = require('bcrypt-nodejs')
const autoBind = require('auto-bind')


/**
 * class that represents the user
 * entity
 * 
 * @class
 */
module.exports = (sequelize) => {
  class User extends Model {

    static init (sequelize) {
      return super.init({
        username: DataTypes.STRING,
        password: DataTypes.STRING
      }, {sequelize, 
          underscored: true,
          hooks: {
            beforeCreate: User.beforeCreate,
            beforeUpdate: User.beforeUpdate
          }
        })
    }

    /**
     * update the attributed password
     * to a bcrypt generated hash if it's not null
     */
    generatePasswordHash () {
      if (this.password === null) {
        return null
      }

      const salt = bcrypt.genSaltSync()
      this.password = bcrypt.hashSync(this.password, salt)
      return this.password
    }

    /**
     * verifies if passed password is valid
     * based on bcrypt
     * 
     * @param password - user's password
     */
    validatePassword (password) {
      return bcrypt.compareSync(password, this.password)
    }

    /**
     * verifies if user has the admin role
     */
    isAdmin () {
     const isAdmin = this.roles.find(role => role.name === 'Admin')
     return isAdmin ? true : false
    }

    /**
     * creates an object to be sent as response
     */
    async responseObject () {

      const roles = await this.getRoles()

      const responseObject = {
        id: this.id,
        username: this.username,
        password: this.password,
        roles: roles.map(role => role.responseObject())
      }

      return responseObject
    }

    static associate (models) {
      this.belongsToMany(models.Role, { through: 'UserRoles', as: 'roles', foreignKey: 'user_id', onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    }

    static beforeCreate (model) {
      model.generatePasswordHash()
    }

    static beforeUpdate (model) {
      model.generatePasswordHash()
    }
  }

  return User
}