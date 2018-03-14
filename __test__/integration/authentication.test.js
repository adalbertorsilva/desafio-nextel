const request = require('supertest')
const app = require('../../app')
const User = require('../../models').User
const Role = require('../../models').Role
const UserRole = require('../../models').UserRole
const AuditEvent = require('../../models').AuditEvent

describe('Authentication', () => {
  describe('Test user token generation', () => {
    it('Must generate a token for the user', async () =>{
      const user  = new User()
      const userData = {
        username: 'adminuser',
        password: user.generatePasswordHash('standardpassword')
      }

      const adminUser = await User.create(userData)
      const userPayload = {username: 'adminuser', password: 'standardpassword'}

      const response = await request(app).post('/authenticate').send(userPayload)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(response.body.token).not.toBeNull()
    })

    it('Must return a 403 and an error message if password is not correct', async () =>{
      const user  = new User()
      const userData = {
        username: 'adminuser',
        password: user.generatePasswordHash('standardpassword')
      }

      const adminUser = await User.create(userData)
      const userPayload = {username: 'adminuser', password: 'bla bla bla'}

      const response = await request(app).post('/authenticate').send(userPayload)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', 'Invalid password!')
    })

    it('Must return a 403 and an error message if user does not exist', async () =>{
      const user  = new User()
      const userData = {
        username: 'adminuser',
        password: user.generatePasswordHash('standardpassword')
      }

      const adminUser = await User.create(userData)
      const userPayload = {username: 'i do not exist', password: 'standardpassword'}

      const response = await request(app).post('/authenticate').send(userPayload)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', 'User not found!')
    })
  })

  describe('Test user token validation', () => {
    it('Must return a 403 status if token is not valid', async () =>{
      const response = await request(app).get('/users')
      expect(response.status).toBe(403)
    })
  })
})