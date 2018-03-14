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

    responseObject () {
      const responseObject = {
        id: this.id,
        name: this.name,
        point: this.point,
        radius: this.radius
      }

      return responseObject
    }
  }
  return ProtectionArea;
};