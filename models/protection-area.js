'use strict'
const {Model, DataTypes} = require('sequelize')

module.exports = (sequelize) => {
  class ProtectionArea extends Model {
    static init (sequelize) {
      return super.init({
        name: DataTypes.STRING,
        point: DataTypes.GEOMETRY('POINT'),
        radius: DataTypes.FLOAT,
        super_hero_id: DataTypes.INTEGER
      }, {sequelize, underscored: true})
    }
  }
  return ProtectionArea;
};