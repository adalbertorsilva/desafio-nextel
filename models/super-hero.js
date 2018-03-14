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
        alis: this.alias
      }

      return responseObject
    }

    static associate (models) {
      this.hasOne(models.ProtectionArea, {as: 'area'})
    }
  }

  return SuperHero;
};