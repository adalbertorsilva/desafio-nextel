'use strict'
const {Model, DataTypes} = require('sequelize')

module.exports = (sequelize) => {
  class HeroPower extends Model {
    static init (sequelize) {
      return super.init({
        hero_id: DataTypes.INTEGER,
        power_id: DataTypes.INTEGER
      }, {sequelize, underscored: true})
    }
  }

  return HeroPower
}