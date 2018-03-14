const request = require('supertest')
const app = require('../../app')
const User = require('../../models').User
const Role = require('../../models').Role
const UserRole = require('../../models').UserRole
const jwt = require('jsonwebtoken')
require('dotenv').config()

describe('User', () => {
  let standardRole
  let adminRole
  beforeAll(async () => {
    standardRole = await Role.create({name: 'Standard'})
    adminRole = await Role.create({name: 'Admin'})
  })

  const createStandardUser = async () => {
    const standardUser = await User.create({username: 'standarduser', password: 'standardpassword'})
    await UserRole.create({user_id: standardUser.id, role_id: standardRole.id})
    const userToken = jwt.sign({user_id: standardUser.id}, process.env.TOKEN_SECRET)

    standardUser.token = userToken

    return standardUser
  }

  const createAdminUser = async () => {
    const adminUser =  await User.create({username:'adminuser', password:'standardpswd'})
    await UserRole.create({user_id: adminUser.id, role_id: adminRole.id})
    const userToken = jwt.sign({user_id: adminUser.id}, process.env.TOKEN_SECRET)

    adminUser.token = userToken

    return adminUser
  }

  describe('Test hero creation route', () => {
    it('Must return an 403 status if user is not Admin ', async () =>{
      
        const standardUser = await createStandardUser()
        const heroPayload = { name: 'Spiderman', alias: 'Peter Parker' }

        const response = await request(app).post('/heroes').send(heroPayload).set('Authorization', standardUser.token)

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      
      const adminUser =  await createAdminUser()
      const heroPayload = { name: 'Spiderman', alias: 'Peter Parker' }

      const response = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body.id).not.toBeNull()
    })
  })
})