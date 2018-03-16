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