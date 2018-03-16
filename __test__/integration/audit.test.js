const request = require('supertest')
const app = require('../../app')
const User = require('../../models').User
const Role = require('../../models').Role
const UserRole = require('../../models').UserRole
const AuditEvent = require('../../models').AuditEvent
const jwt = require('jsonwebtoken')

describe('Audit', async () => {

  let standardRole = {}
  let adminRole = {}
  let adminUser = {}
  let standardUser = {} 

  beforeAll(async () => {
    standardRole = await Role.find({where: {name: 'Standard'}})
    adminRole = await Role.find({where: {name: 'Admin'}})
    adminUser = await createAdminUser()
    standardUser = await createStandardUser()
  })
  
  const createStandardUser = async () => {
    const standardUser = await User.create({username: 'auditstandarduser', password: 'standardpassword'})
    await UserRole.create({user_id: standardUser.id, role_id: standardRole.id})
    const userToken = jwt.sign({user_id: standardUser.id}, process.env.TOKEN_SECRET)

    standardUser.token = userToken

    return standardUser
  }

  const createAdminUser = async () => {
    const adminUser =  await User.create({username:'adminauditadminuser', password:'standardpswd'})
    await UserRole.create({user_id: adminUser.id, role_id: adminRole.id})
    const userToken = jwt.sign({user_id: adminUser.id}, process.env.TOKEN_SECRET)

    adminUser.token = userToken

    return adminUser
  }

  describe('Test audit event creation', () => {

    it('Must create an audit event on database', async () =>{
        const userPayload = {username: 'audit user Payload', password: 'anything', roles: [{id: standardRole.id, name: standardRole.name}]}

        const response = await request(app).post('/users').send(userPayload).set('Authorization', adminUser.token)

        expect(response.status).toBe(200)

        const auditEvents = await AuditEvent.findAll({where:{entity_id: response.body.id}})

        expect(auditEvents.length).toBeGreaterThan(0)
    })
  })

  describe('Test audit event find all', () => {
    it('Must return 200 a list of objects', async () =>{

        const response = await request(app).get('/audit_events').set('Authorization', adminUser.token)

        expect(response.status).toBe(200)
        expect(response.body.length).toBeGreaterThanOrEqual(1)
        expect(response.body[0]).toHaveProperty('id')
        expect(response.body[0]).toHaveProperty('entity')
        expect(response.body[0]).toHaveProperty('entity_id')
        expect(response.body[0]).toHaveProperty('username')
        expect(response.body[0]).toHaveProperty('action')
        expect(response.body[0]).toHaveProperty('datetime')
        expect(response.body[0]).not.toHaveProperty('created_at')
        expect(response.body[0]).not.toHaveProperty('updated_at')

    })
  })
})