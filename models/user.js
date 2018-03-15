'use strict'

const {Model, DataTypes} = require('sequelize')
const bcrypt = require('bcrypt-nodejs')
const autoBind = require('auto-bind')
const Role = require('./role')

module.exports = (sequelize) => {
  class User extends Model {
    static init (sequelize) {
      return super.init({
        username: DataTypes.STRING,
        password: DataTypes.STRING
      }, {sequelize, underscored: true})
    }

    generatePasswordHash (password) {
      const salt = bcrypt.genSaltSync()

      if (password) {
        return bcrypt.hashSync(password, salt)
      } else {
        this.password = bcrypt.hashSync(this.password, salt)
        return this.password
      }
    }

    validatePassword (password) {
      return bcrypt.compareSync(password, this.password)
    }

    isAdmin () {
     const isAdmin = this.roles.find(role => role.name === 'Admin')
     return isAdmin ? true : false
    }

    responseObject () {
      const responseObject = {
        id: this.id,
        username: this.username,
        password: this.password,
        roles: this.roles
      }

      return responseObject
    }

    static associate (models) {
      this.belongsToMany(models.Role, { through: 'UserRoles', onDelete: 'CASCADE', as: 'roles', foreignKey: 'user_id' })
    }
  }

  return User
}