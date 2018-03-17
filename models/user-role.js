'use strict'
const {Model, DataTypes} = require('sequelize')

/**
 * class that represents the
 * join table between user and role
 * 
 * @class
 */
module.exports = (sequelize) => {
  class UserRole extends Model {
    static init (sequelize) {
      return super.init({
        user_id: DataTypes.INTEGER,
        role_id: DataTypes.INTEGER
      }, {sequelize, underscored: true})
    }
  }

  return UserRole
}