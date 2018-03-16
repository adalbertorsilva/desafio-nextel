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
  let adminUser = {}
  let standardUser = {}
  beforeAll(async () => {
    standardRole = await Role.find({where: {name: 'Standard'}})
    adminRole = await Role.find({where: {name: 'Admin'}})
    adminUser = await createAdminUser()
    standardUser = await createStandardUser()
  })

  const createStandardUser = async () => {
    const standardUser = await User.create({username:'standarduser', password:'standardpassword'})
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
    it('Must return an 403 status if user is not Admin ', async () => {

      const userPayload = {username: 'Payload', password: 'anything'}

      const response = await request(app).post('/users').send(userPayload).set('Authorization', standardUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      
      const userPayload = {username: 'Payload', password: 'anything'}
      const response = await request(app).post('/users').send(userPayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body.id).not.toBeNull()
      expect(response.body).toHaveProperty('username', userPayload.username)
      expect(response.body).toHaveProperty('password')
      expect(response.body.password).not.toEqual(userPayload.password)
    })

    it('Must return an 403 status and a fulfiled object with an error message  ', async () =>{
      
      const userPayload = {username: 'Payload', password: 'anything'}
      const response = await request(app).post('/users').send(userPayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "User already exists")
    })
  })

  describe('Test user find all route', () => {

    it('Must return an 403 status if user is not Admin ', async () =>{

      const response = await request(app).get(`/users/${0}/${2}`).set('Authorization', standardUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
  })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{

      const response = await request(app).get(`/users/${0}/${2}`).set('Authorization', adminUser.token)

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(2)
    })
  })

  describe('Test user update route', () => {

    it('Must return an 403 status if user is not Admin ', async () =>{

      const response = await request(app).put(`/users/${standardUser.id}`).send({}).set('Authorization', standardUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
  })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{

      const userPayload = {username: 'user update Payload', password: 'anything', bla: true}
      const userUpdatePayload = {username: 'Other Payload', password: 'something'}

      const userResponse = await request(app).post('/users').send(userPayload).set('Authorization', adminUser.token)
      const response = await request(app).put(`/users/${userResponse.body.id}`).send(userUpdatePayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body.id).not.toBeNull()
      expect(response.body).toHaveProperty('username', userUpdatePayload.username)
      expect(response.body).toHaveProperty('password')
      expect(response.body.password).not.toEqual(userUpdatePayload.password)
      expect(response.body).not.toHaveProperty('created_at')
      expect(response.body).not.toHaveProperty('updated_at')
    })
  })

  describe('Test user find one route', () => {

    it('Must return an 403 status if user is not Admin ', async () =>{

      const response = await request(app).get(`/users/${standardUser.id}`).set('Authorization', standardUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{

      const response = await request(app).get(`/users/${adminUser.id}`).set('Authorization', adminUser.token)
      
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body.id).not.toBeNull()
      expect(response.body).toHaveProperty('username', adminUser.username)
      expect(response.body).toHaveProperty('password')
    })
  })

  describe('Test user delete route', () => {

    it('Must return an 403 status if user is not Admin ', async () =>{

      const response = await request(app).delete(`/users/${standardUser.id}`).set('Authorization', standardUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{

      const response = await request(app).delete(`/users/${adminUser.id}`).set('Authorization', adminUser.token)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('message', 'User removed')
    })
  })
})