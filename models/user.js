'use strict'

const {Model, DataTypes} = require('sequelize')
const bcrypt = require('bcrypt-nodejs')

module.exports = (sequelize) => {
  class User extends Model {
    static init (sequelize) {
      return super.init({
        username: DataTypes.STRING,
        password: DataTypes.STRING
      }, {sequelize, underscored: true})
    }

    generatePasswordHash () {
      const salt = bcrypt.genSaltSync()
      this.password = bcrypt.hashSync(this.password, salt)
    }

    validatePassword (password) {
      return bcrypt.compareSync(password, this.password)
    }

    static associate (models) {

    }
  }

  return User
}