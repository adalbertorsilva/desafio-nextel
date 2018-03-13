const request = require('supertest')
const app = require('../../app')
const User = require('../../models').User
const Role = require('../../models').Role
const UserRole = require('../../models').UserRole
const AuditEvent = require('../../models').AuditEvent
const jwt = require('jsonwebtoken')

describe('Authentication', () => {
  describe('Test audit event creation', () => {
    it('Must create an audit event on database', async () =>{
        const adminUser = await User.create({username: 'adminuser', password: 'standardpassword'})
        const adminRole = await Role.create({name: 'Admin'})
        await UserRole.create({user_id: adminUser.id, role_id: adminRole.id})
        const userToken = jwt.sign({user_id: adminUser.id}, process.env.TOKEN_SECRET)
        const userPayload = {username: 'Payload', password: 'anything', roles: ['standard']}

        const response = await request(app).post('/users').send(userPayload).set('Authorization', userToken)

        expect(response.status).toBe(200)

        const auditEvents = await AuditEvent.findAll({where:{entity_id: response.body.id}})

        expect(auditEvents).toHaveLength(1)
    })
  })

  describe('Test audit event find all', () => {
    it('Must generate a token for the user', async () =>{
        const adminUser = await User.create({username: 'adminuser', password: 'standardpassword'})
        const adminRole = await Role.create({name: 'Admin'})
        await UserRole.create({user_id: adminUser.id, role_id: adminRole.id})
        const userToken = jwt.sign({user_id: adminUser.id}, process.env.TOKEN_SECRET)

        const response = await request(app).get('/audit_events').set('Authorization', userToken)

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(1)
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