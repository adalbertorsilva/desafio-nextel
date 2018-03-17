'use strict'
const {Model, DataTypes} = require('sequelize')

/**
 * class that represents the role
 * entity
 * 
 * @class
 */
module.exports = (sequelize) => {
  class Role extends Model {
    static init (sequelize) {
      return super.init({
        name: DataTypes.STRING
      }, {sequelize, underscored: true})
    }

    /**
     * creates an object to be sent as response
     */
    responseObject () {
      const responseObject = {
        id: this.id,
        name: this.name
      }

      return responseObject
    }

    static associate (models) {
      this.belongsToMany(models.User, { through: 'UserRoles', onDelete: 'CASCADE', as: 'users', foreignKey: 'role_id' })
    }
  }

  return Role
}