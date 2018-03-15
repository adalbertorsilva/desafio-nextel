const request = require('supertest')
const app = require('../../app')
const User = require('../../models').User
const Role = require('../../models').Role
const UserRole = require('../../models').UserRole
const SuperPower = require('../../models').SuperPower
const SuperHero = require('../../models').SuperHero
const HeroPower = require('../../models').HeroPower
const jwt = require('jsonwebtoken')
require('dotenv').config()

describe('super power', () => {
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

  describe('Test super power creation route', () => {
    it('Must return an 403 status if user is not Admin ', async () =>{
      
        const standardUser = await createStandardUser()
        const powerPayload = { name: 'Spider insinct', description: 'Sense incoming threats' }

        const response = await request(app).post('/powers').send(powerPayload).set('Authorization', standardUser.token)

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      
      const adminUser =  await createAdminUser()
      const powerPayload = { name: 'Spider insinct', description: 'Sense incoming threats' }

      const response = await request(app).post('/powers').send(powerPayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('name', powerPayload.name)
      expect(response.body).toHaveProperty('description', powerPayload.description)
      expect(response.body).not.toHaveProperty('created_at')
      expect(response.body).not.toHaveProperty('updated_at')
    })
  })

  describe('Test super power find all route', () => {
    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      
      const adminUser = await createAdminUser()
      const response = await request(app).get('/powers').set('Authorization',  adminUser.token)
      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(1)
      expect(response.body[0]).toHaveProperty('id')
      expect(response.body[0]).toHaveProperty('name')
      expect(response.body[0]).toHaveProperty('description')
      expect(response.body[0]).not.toHaveProperty('created_at')
      expect(response.body[0]).not.toHaveProperty('updated_at')
    })

    it('Must return an 200 status and a fulfiled object if user is Standard ', async () =>{
      
        const standardUser = await createStandardUser()
        const response = await request(app).get('/powers').set('Authorization',  standardUser.token)
        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(1)
        expect(response.body[0]).toHaveProperty('id')
        expect(response.body[0]).toHaveProperty('name')
        expect(response.body[0]).toHaveProperty('description')
        expect(response.body[0]).not.toHaveProperty('created_at')
        expect(response.body[0]).not.toHaveProperty('updated_at')
    })
  })

  describe('Test super power find one route', () => {
    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      
      const adminUser = await createAdminUser()

      const powerPayload = { name: 'Spider insinct', description: 'Sense incoming threats' }

      const superPowerResponse = await request(app).post('/powers').send(powerPayload).set('Authorization', adminUser.token)

      const response = await request(app).get(`/powers/${superPowerResponse.body.id}`).set('Authorization',  adminUser.token)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('name')
      expect(response.body).toHaveProperty('description')
      expect(response.body).not.toHaveProperty('created_at')
      expect(response.body).not.toHaveProperty('updated_at')
    })

    it('Must return an 200 status and a fulfiled object if user is Standard ', async () =>{
      
        const standardUser = await createStandardUser()
        const adminUser = await createAdminUser()

        const powerPayload = { name: 'Spider insinct', description: 'Sense incoming threats' }

        const superPowerResponse = await request(app).post('/powers').send(powerPayload).set('Authorization', adminUser.token)
        const response = await request(app).get(`/powers/${superPowerResponse.body.id}`).set('Authorization',  standardUser.token)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('description')
        expect(response.body).not.toHaveProperty('created_at')
        expect(response.body).not.toHaveProperty('updated_at')
    })
  })

  describe('Test super power update route', () => {

    it('Must return an 403 status if user is not Admin ', async () =>{
      
        const standardUser = await createStandardUser()
        const adminUser = await createAdminUser()

        const powerPayload = { name: 'Spider insinct', description: 'Sense incoming threats' }

        const superPowerResponse = await request(app).post('/powers').send(powerPayload).set('Authorization', adminUser.token)
        const response = await request(app).put(`/powers/${superPowerResponse.body.id}`).send(powerPayload).set('Authorization', standardUser.token)

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      
      const adminUser = await createAdminUser()

      const superPowerPayload = { name: 'Spider insinct', description: 'Sense incoming threats' }
      const superPowerUpdatePayload = { name: 'Spider web', description: 'Catch thiaves just like flies' }

      const superPowerResponse = await request(app).post('/powers').send(superPowerPayload).set('Authorization', adminUser.token)
      const response = await request(app).put(`/powers/${superPowerResponse.body.id}`).send(superPowerUpdatePayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body.id).not.toBeNull()
      expect(response.body).toHaveProperty('name', superPowerUpdatePayload.name)
      expect(response.body).toHaveProperty('description', superPowerUpdatePayload.description)
      expect(response.body).not.toHaveProperty('created_at')
      expect(response.body).not.toHaveProperty('updated_at')
    })
  })

  describe('Test super power delete route', () => {

    it('Must return an 403 status if user is not Admin ', async () =>{
      
      const standardUser = await createStandardUser()
      const adminUser = await createAdminUser()

      const powerPayload = { name: 'Spider insinct', description: 'Sense incoming threats' }

      const superPowerResponse = await request(app).post('/powers').send(powerPayload).set('Authorization', adminUser.token)
      const response = await request(app).delete(`/powers/${superPowerResponse.body.id}`).set('Authorization', standardUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 403 status if it has a super hero binded', async () =>{
      
      const adminUser = await createAdminUser()

      const heroPayload = { 
        name: 'Spiderman', 
        alias: 'Peter Parker', 
        area: {
          name: 'New York',
          point: { type: 'Point', coordinates: [40.671725,-73.945351]},
          radius: 8.5
        }
      }

      const hero = await SuperHero.create(heroPayload)
      const power = await SuperPower.create({ name: 'Spider insinct', description: 'Sense incoming threats' })
      await HeroPower.create({hero_id: hero.id, power_id: power.id})

      const response = await request(app).delete(`/powers/${power.id}`).set('Authorization', adminUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', 'Super power can not be removed because it has a super hero binded to it')
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      
      const adminUser = await createAdminUser()

      const powerPayload = { name: 'Spider insinct', description: 'Sense incoming threats' }

      const superPowerResponse = await request(app).post('/powers').send(powerPayload).set('Authorization', adminUser.token)
      const response = await request(app).delete(`/powers/${superPowerResponse.body.id}`).set('Authorization', adminUser.token)

      const superPower = await SuperPower.findById(superPowerResponse.body.id)

      expect(response.status).toBe(200)
      expect(superPower).toBeNull()
    })
  })
})