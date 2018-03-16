const request = require('supertest')
const app = require('../../app')
const User = require('../../models').User
const Role = require('../../models').Role
const UserRole = require('../../models').UserRole
const jwt = require('jsonwebtoken')
require('dotenv').config()

describe('User Roles', () => {
  let standardRole = {}
  let adminRole = {}
  let adminUser = {}
  let standardUser = {}
  beforeAll(async () => {
    standardRole = await Role.find({where: {name: 'Standard'}})
    adminRole = await Role.find({where: {name: 'Admin'}})
    adminUser = await createAdminUser()
  })

  const createAdminUser = async () => {
    const adminUser =  await User.create({username:'userroleadminuser', password:'standardpswd'})
    await UserRole.create({user_id: adminUser.id, role_id: adminRole.id})
    const userToken = jwt.sign({user_id: adminUser.id}, process.env.TOKEN_SECRET)

    adminUser.token = userToken

    return adminUser
  }

  describe('Test user creation route', () => {

    it('Must return an 200 status and a fulfiled object with routes attribute ', async () =>{
      
      const userPayload = { username:'user role user', password:'blablabla' ,
          roles: [{id: standardRole.id, name: standardRole.name}]
        }

      const response = await request(app).post('/users').send(userPayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body.id).not.toBeNull()
      expect(response.body).toHaveProperty('name', userPayload.name)
      expect(response.body).toHaveProperty('password')
      expect(response.body.password).not.toEqual(userPayload.password)
      expect(response.body).not.toHaveProperty('created_at')
      expect(response.body).not.toHaveProperty('updated_at')
      expect(response.body).toHaveProperty('roles')
      expect(response.body.roles).toHaveLength(1)
      expect(response.body.roles[0]).toHaveProperty('name', standardRole.name)
    })
  })

  describe('Test user find all route', () => {
    it('Must return an 200 status and a list of fulfiled objects with routes attribute ', async () =>{
      
      const response = await request(app).get(`/users/${0}/${1}`).set('Authorization',  adminUser.token)
      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toHaveProperty('id')
      expect(response.body[0]).toHaveProperty('username')
      expect(response.body[0]).toHaveProperty('password')
      expect(response.body[0]).not.toHaveProperty('created_at')
      expect(response.body[0]).not.toHaveProperty('updated_at')
      expect(response.body[0]).toHaveProperty('roles')
    })
  })

  describe('Test user find one route', () => {
    it('Must return an 200 status and a fulfiled object with roles attribute ', async () =>{
      
        const userPayload = { username:'another user role user', password:'blablabla' ,
            roles: [{id: standardRole.id, name: standardRole.name}]
          }

      const userResponse = await request(app).post('/users').send(userPayload).set('Authorization', adminUser.token)

      const response = await request(app).get(`/users/${userResponse.body.id}`).set('Authorization',  adminUser.token)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('username', userPayload.username)
      expect(response.body).toHaveProperty('password')
      expect(response.body).not.toHaveProperty('created_at')
      expect(response.body).not.toHaveProperty('updated_at')
      expect(response.body).toHaveProperty('roles')
      expect(response.body.roles).toHaveLength(1)
      expect(response.body.roles[0]).toHaveProperty('name', standardRole.name)
    })
  })

  describe('Test hero update route', () => {
    it('Must return an 200 status and a fulfiled object with powers attribute ', async () =>{

      const userPayload = { username:'one more user role user', password:'blablabla' ,
        roles: [{id: standardRole.id, name: standardRole.name}]
      }

      const userUpdatedPayload = { username:'user role user updated', password:'blablabla' ,
        roles: [{id: adminRole.id, name: adminRole.name}]
      }

      const userResponse = await request(app).post('/users').send(userPayload).set('Authorization', adminUser.token)
      const response = await request(app).put(`/users/${userResponse.body.id}`).send(userUpdatedPayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body.id).not.toBeNull()
      expect(response.body).toHaveProperty('username', userUpdatedPayload.username)
      expect(response.body).toHaveProperty('password')
      expect(response.body).not.toHaveProperty('created_at')
      expect(response.body).not.toHaveProperty('updated_at')
      expect(response.body).toHaveProperty('roles')
      expect(response.body.roles).toHaveLength(1)
      expect(response.body.roles[0]).toHaveProperty('name', adminRole.name)
    })
  })

  describe('Test super hero delete route', () => {

    it('Must return an 200 status and a fulfiled object with powers attribute ', async () =>{

      const userPayload = { username:'user role user once more', password:'blablabla' ,
        roles: [{id: standardRole.id, name: standardRole.name}]
      }

      const userResponse = await request(app).post('/users').send(userPayload).set('Authorization', adminUser.token)
      const response = await request(app).delete(`/users/${userResponse.body.id}`).set('Authorization', adminUser.token)

      const user = await User.findById(userResponse.body.id)
      const userRoles = await UserRole.findAll({where:{user_id: userResponse.body.id}})
      
      expect(response.status).toBe(200)
      expect(user).toBeNull()
      expect(userRoles).toHaveLength(0)
    })
  })
})