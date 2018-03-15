const request = require('supertest')
const app = require('../../app')
const User = require('../../models').User
const Role = require('../../models').Role
const UserRole = require('../../models').UserRole
const jwt = require('jsonwebtoken')
require('dotenv').config()

describe('User', () => {
  let standardRole = {}
  let adminRole = {}
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

  describe('Test user creation route', () => {
    it('Must return an 403 status if user is not Admin ', async () =>{
      
        const standardUser = await createStandardUser()
        const userPayload = {username: 'Payload', password: 'anything'}

        const response = await request(app).post('/users').send(userPayload).set('Authorization', standardUser.token)

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      
      const adminUser =  await createAdminUser()
      const userPayload = {username: 'Payload', password: 'anything', roles: ['standard']}
      const response = await request(app).post('/users').send(userPayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body.id).not.toBeNull()
      expect(response.body).toHaveProperty('username', userPayload.username)
      expect(response.body).toHaveProperty('password')
      expect(response.body.password).not.toEqual(userPayload.password)
      expect(response.body).toHaveProperty('roles')
      expect(response.body.roles).toHaveLength(1)

      const userRoles = await UserRole.findAll({where: {user_id: response.body.id}})

      expect(userRoles).toHaveLength(1)
    })
  })

  describe('Test user find all route', () => {

    it('Must return an 403 status if user is not Admin ', async () =>{
      
      const standardUser = await createStandardUser()

      const response = await request(app).get('/users').set('Authorization', standardUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
  })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      
      const adminUser =  await User.create({username:'adminuser', password:'standardpswd'})
      await UserRole.create({user_id: adminUser.id, role_id: adminRole.id})
      const userToken = jwt.sign({user_id: adminUser.id}, process.env.TOKEN_SECRET)

      const response = await request(app).get('/users').set('Authorization', userToken)

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(5)
    })
  })

  describe('Test user update route', () => {

    it('Must return an 403 status if user is not Admin ', async () =>{
      
      const standardUser = await createStandardUser()

      const response = await request(app).put(`/users/${standardUser.id}`).send({}).set('Authorization', standardUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
  })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      
      const adminUser =  await User.create({username:'adminuser', password:'standardpswd'})
      await UserRole.create({user_id: adminUser.id, role_id: adminRole.id})
      const userToken = jwt.sign({user_id: adminUser.id}, process.env.TOKEN_SECRET)
      const userPayload = {username: 'Payload2', password: 'anything', roles: ['standard', 'admin']}

      const response = await request(app).put(`/users/${adminUser.id}`).send(userPayload).set('Authorization', userToken)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body.id).not.toBeNull()
      expect(response.body).toHaveProperty('username', userPayload.username)
      expect(response.body).toHaveProperty('password')
      expect(response.body).toHaveProperty('roles')
      expect(response.body.roles).toHaveLength(2)

      const userRoles = await UserRole.findAll({where: {user_id: response.body.id}})

      expect(userRoles).toHaveLength(2)
      
    })
  })

  describe('Test user find one route', () => {

    it('Must return an 403 status if user is not Admin ', async () =>{
        
      const standardUser = await createStandardUser()

      const response = await request(app).get(`/users/${standardUser.id}`).set('Authorization', standardUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      
      const adminUser =  await User.create({username:'adminuser', password:'standardpswd'})
      await UserRole.create({user_id: adminUser.id, role_id: adminRole.id})
      const userToken = jwt.sign({user_id: adminUser.id}, process.env.TOKEN_SECRET)

      const response = await request(app).get(`/users/${adminUser.id}`).set('Authorization', userToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body.id).not.toBeNull()
      expect(response.body).toHaveProperty('username', adminUser.username)
      expect(response.body).toHaveProperty('password')
      expect(response.body).toHaveProperty('roles')
      expect(response.body.roles).toHaveLength(1)
    })
  })

  describe('Test user delete route', () => {

    it('Must return an 403 status if user is not Admin ', async () =>{
        
      const standardUser = await createStandardUser()

      const response = await request(app).delete(`/users/${standardUser.id}`).set('Authorization', standardUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      
      const adminUser =  await User.create({username:'adminuser', password:'standardpswd'})
      await UserRole.create({user_id: adminUser.id, role_id: adminRole.id})
      const userToken = jwt.sign({user_id: adminUser.id}, process.env.TOKEN_SECRET)

      const response = await request(app).delete(`/users/${adminUser.id}`).set('Authorization', userToken)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', 'User removed')

      const userRoles = await UserRole.findAll({where: {user_id: adminUser.id}})
      expect(userRoles).toHaveLength(0)
    })
  })
})