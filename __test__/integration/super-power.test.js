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

describe('Super Power', () => {
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
    const standardUser = await User.create({username: 'superpowerstandarduser', password: 'standardpassword'})
    await UserRole.create({user_id: standardUser.id, role_id: standardRole.id})
    const userToken = jwt.sign({user_id: standardUser.id}, process.env.TOKEN_SECRET)

    standardUser.token = userToken

    return standardUser
  }

  const createAdminUser = async () => {
    const adminUser =  await User.create({username:'superpoweradminuser', password:'standardpswd'})
    await UserRole.create({user_id: adminUser.id, role_id: adminRole.id})
    const userToken = jwt.sign({user_id: adminUser.id}, process.env.TOKEN_SECRET)

    adminUser.token = userToken

    return adminUser
  }

  describe('Test super power creation route', () => {
    it('Must return an 403 status if user is not Admin ', async () =>{
      
        const powerPayload = { name: 'Spider insinct', description: 'Sense incoming threats' }

        const response = await request(app).post('/powers').send(powerPayload).set('Authorization', standardUser.token)

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      
      const powerPayload = { name: 'Spider Web', description: 'Catch thieves just like flies' }

      const response = await request(app).post('/powers').send(powerPayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('name', powerPayload.name)
      expect(response.body).toHaveProperty('description', powerPayload.description)
      expect(response.body).not.toHaveProperty('created_at')
      expect(response.body).not.toHaveProperty('updated_at')
    })

    it('Must return an 403 status and a fulfiled object with an error message ', async () =>{
      
      const powerPayload = { name: 'Spider Web', description: 'Catch thieves just like flies' }

      const response = await request(app).post('/powers').send(powerPayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "Super Power already exists")
    })
  })

  describe('Test super power find all route', () => {
    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      
      const response = await request(app).get(`/powers/${0}/${1}`).set('Authorization',  adminUser.token)
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(1)
      expect(response.body[0]).toHaveProperty('id')
      expect(response.body[0]).toHaveProperty('name')
      expect(response.body[0]).toHaveProperty('description')
      expect(response.body[0]).not.toHaveProperty('created_at')
      expect(response.body[0]).not.toHaveProperty('updated_at')
    })

    it('Must return an 200 status and a fulfiled object if user is Standard ', async () =>{
      
        const response = await request(app).get(`/powers/${0}/${1}`).set('Authorization',  standardUser.token)
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(1)
        expect(response.body[0]).toHaveProperty('id')
        expect(response.body[0]).toHaveProperty('name')
        expect(response.body[0]).toHaveProperty('description')
        expect(response.body[0]).not.toHaveProperty('created_at')
        expect(response.body[0]).not.toHaveProperty('updated_at')
    })
  })

  describe('Test super power find one route', () => {
    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      

      const powerPayload = { name: 'Super Strength', description: 'Lift super heavy things' }

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

        const powerPayload = { name: 'X-Ray Vision', description: 'See through things' }

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

        const powerPayload = { name: 'Telekinesis', description: 'Move things with mind power' }

        const superPowerResponse = await request(app).post('/powers').send(powerPayload).set('Authorization', adminUser.token)
        const response = await request(app).put(`/powers/${superPowerResponse.body.id}`).send(powerPayload).set('Authorization', standardUser.token)

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{
      

      const superPowerPayload = { name: 'Invisibility', description: "Now you see me... Now you don't" }
      const superPowerUpdatePayload = { name: 'Adamantium Claws', description: 'Cuts everything' }

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

      const powerPayload = { name: 'X Factor', description: 'Regeneration' }

      const superPowerResponse = await request(app).post('/powers').send(powerPayload).set('Authorization', adminUser.token)
      const response = await request(app).delete(`/powers/${superPowerResponse.body.id}`).set('Authorization', standardUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 403 status if it has a super hero binded', async () =>{

      const heroPayload = { 
        name: 'Ironman', 
        alias: 'Tony Stark', 
        area: {
          name: 'Stark Inc',
          point: { type: 'Point', coordinates: [40.671725,-73.945351]},
          radius: 8.5
        }
      }

      const hero = await SuperHero.create(heroPayload)
      const power = await SuperPower.create({ name: 'Proton Cannon', description: 'Cool tech stuff' })
      await HeroPower.create({hero_id: hero.id, power_id: power.id})

      const response = await request(app).delete(`/powers/${power.id}`).set('Authorization', adminUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', 'Super power can not be removed because it has a super hero binded to it')
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () =>{

      const powerPayload = { name: 'March 4 Armour', description: 'Hightech Armour' }

      const superPowerResponse = await request(app).post('/powers').send(powerPayload).set('Authorization', adminUser.token)
      const response = await request(app).delete(`/powers/${superPowerResponse.body.id}`).set('Authorization', adminUser.token)

      const superPower = await SuperPower.findById(superPowerResponse.body.id)

      expect(response.status).toBe(200)
      expect(superPower).toBeNull()
    })
  })
})