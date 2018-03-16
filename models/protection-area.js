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

    static associate (models) {
      this.belongsTo(models.SuperHero, {as: 'hero', foreignKey: 'super_hero_id'})
    }

    static async findNotifiedAreas(coordinates) {
      return await sequelize.query('SELECT * FROM "ProtectionAreas" WHERE ST_DWithin(point::geography, ST_MakePoint(:longitude,:latitude)::geography, 10000) limit 8', { replacements: { longitude: coordinates.longitude, latitude: coordinates.latitude }, model: ProtectionArea})
    }
  }
  return ProtectionArea;

};