'use strict'
const {Model, DataTypes} = require('sequelize')

/**
 * class that represents the
 * super power entity
 * 
 * @class
 */
module.exports = (sequelize) => {
  class SuperPower extends Model {
    static init (sequelize) {
      return super.init({
        name: DataTypes.STRING,
        description: DataTypes.STRING
      }, {sequelize, underscored: true})
    }

    /**
     * creates an object to be sent as response
     */
    responseObject () {
      const responseObject = {
        id: this.id,
        name: this.name,
        description: this.description,
      }

      return responseObject
    }

    static associate (models) {
      this.belongsToMany(models.SuperHero, {through: 'HeroPowers', as: 'heroes', foreignKey: 'power_id',  onUpdate: 'CASCADE', onDelete: 'CASCADE'})
    }
  }
  return SuperPower
};