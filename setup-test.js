const User = require('./models').User
const Role = require('./models').Role
const UserRole = require('./models').UserRole
const AuditEvent = require('./models').AuditEvent
const ProtectionArea = require('./models').ProtectionArea
const SuperHero = require('./models').SuperHero

beforeAll(async () => {
  await clearDatabase()
})

afterAll(async () => {
  await clearDatabase()
})

const clearDatabase = async () => {
  await User.destroy({where: {}})
  await Role.destroy({where: {}})
  await UserRole.destroy({where: {}})
  await AuditEvent.destroy({where: {}})
  await ProtectionArea.destroy({where: {}})
  await SuperHero.destroy({where: {}}) 
}
