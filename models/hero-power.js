'use strict'
const {Model, DataTypes} = require('sequelize')

/**
 * class that represents the
 * join table between super hero and super power
 * 
 * @class
 */
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