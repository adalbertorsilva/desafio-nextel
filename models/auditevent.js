'use strict'
const {Model, DataTypes} = require('sequelize')

module.exports = (sequelize) => {
  class AuditEvent extends Model {
    static init (sequelize) {
      return super.init({
        entity: DataTypes.STRING,
        entity_id: DataTypes.INTEGER,
        username: DataTypes.STRING,
        action: DataTypes.STRING
      }, {sequelize, underscored: true})
    }

    responseObject () {
      const responseObject = {
        id: this.id,
        entity: this.entity,
        entity_id: this.entity_id,
        datetime: this.created_at,
        username: this.username,
        action: this.action
      }

      return responseObject
    }
  }

  return AuditEvent
}