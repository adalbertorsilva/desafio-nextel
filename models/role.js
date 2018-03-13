'use strict'
const {Model, DataTypes} = require('sequelize')

module.exports = (sequelize) => {
  class Role extends Model {
    static init (sequelize) {
      return super.init({
        name: DataTypes.STRING
      }, {sequelize, underscored: true})
    }

    responseObject () {
      const responseObject = {
        name: this.name
      }

      return responseObject
    }

    static associate (models) {
      this.belongsToMany(models.User, {through: 'UserRole'})
    }
  }

  return Role
}