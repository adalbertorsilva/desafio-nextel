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

    async responseObject () {

      const powers = await this.getPowers()

      const responseObject = {
        id: this.id,
        name: this.name,
        alias: this.alias,
        area: this.area.responseObject(),
        powers: powers.map(power => power.responseObject())
      }

      return responseObject
    }

    static associate (models) {
      this.hasOne(models.ProtectionArea, {as: 'area', foreignKey: 'super_hero_id', onDelete: 'CASCADE'})
      this.belongsToMany(models.SuperPower, {through: 'HeroPowers', as: 'powers', foreignKey: 'hero_id', onUpdate: 'CASCADE', onDelete: 'CASCADE'})
    }
  }

  return SuperHero
}