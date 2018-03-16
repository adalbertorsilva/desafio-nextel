const User = require('../models').User
const Role = require('../models').Role
const UserRole = require('../models').UserRole
const AuditEvent = require('../models').AuditEvent
const ProtectionArea = require('../models').ProtectionArea
const SuperHero = require('../models').SuperHero
const SuperPower = require('../models').SuperPower
const HeroPower = require('../models').HeroPower


module.exports = async () => {

  await Role.create({name: 'Standard'})
  await Role.create({name: 'Admin'})

  await User.destroy({where: {}})
  await UserRole.destroy({where: {}})
  await AuditEvent.destroy({where: {}})
  await ProtectionArea.destroy({where: {}})
  await SuperHero.destroy({where: {}}) 
  await SuperPower.destroy({where: {}}) 
  await HeroPower.destroy({where: {}}) 
}