'use strict'

const {Model, DataTypes} = require('sequelize')
const bcrypt = require('bcrypt-nodejs')
const autoBind = require('auto-bind')

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

    generatePasswordHash (password) {
      const salt = bcrypt.genSaltSync()
      this.password = bcrypt.hashSync(this.password, salt)
      return this.password
    }

    validatePassword (password) {
      return bcrypt.compareSync(password, this.password)
    }

    isAdmin () {
     const isAdmin = this.roles.find(role => role.name === 'Admin')
     return isAdmin ? true : false
    }

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