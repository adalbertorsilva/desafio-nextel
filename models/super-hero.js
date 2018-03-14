'use strict'
const {Model, DataTypes} = require('sequelize')

module.exports = (sequelize) => {
  class SuperHero extends Model {
    static init (sequelize) {
      return super.init({
        name: DataTypes.STRING,
        alias: DataTypes.STRING
      }, {sequelize, underscored: true})
    }

    responseObject () {
      const responseObject = {
        id: this.id,
        name: this.name,
        alias: this.alias,
        area: this.area.responseObject()
      }

      return responseObject
    }

    static associate (models) {
      this.hasOne(models.ProtectionArea, {as: 'area', foreignKey: 'super_hero_id', onDelete: 'CASCADE'})
    }
  }

  return SuperHero;
};