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

describe('Super Hero Powers', () => {
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
    const adminUser =  await User.create({username:'heropoweradminuser', password:'standardpswd'})
    await UserRole.create({user_id: adminUser.id, role_id: adminRole.id})
    const userToken = jwt.sign({user_id: adminUser.id}, process.env.TOKEN_SECRET)

    adminUser.token = userToken

    return adminUser
  }

  describe('Test super hero creation route', () => {

    it('Must return an 200 status and a fulfiled object with powers attribute ', async () =>{
      
      const power = await SuperPower.create({ name: 'Kamehameha', description: 'KAME.....HAME.....HA !!!!!!!!' })
      const heroPayload = { 
          name: 'Goku', 
          alias: 'Kakaroto', 
          area: {
            name: 'Earth',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
          },
          powers: [{id: power.id, name: power.name, description: power.description}]
        }

      const response = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body.id).not.toBeNull()
      expect(response.body).toHaveProperty('name', heroPayload.name)
      expect(response.body).toHaveProperty('alias', heroPayload.alias)
      expect(response.body).not.toHaveProperty('created_at')
      expect(response.body).not.toHaveProperty('updated_at')
      expect(response.body).toHaveProperty('area')
      expect(response.body.area).toHaveProperty('name', heroPayload.area.name)
      expect(response.body.area).toHaveProperty('point')
      expect(response.body.area).toHaveProperty('radius', heroPayload.area.radius)
      expect(response.body.area).not.toHaveProperty('created_at')
      expect(response.body.area).not.toHaveProperty('updated_at')
      expect(response.body).toHaveProperty('powers')
      expect(response.body.powers).toHaveLength(1)
      expect(response.body.powers[0]).toHaveProperty('name', power.name)
      expect(response.body.powers[0]).toHaveProperty('description', power.description)
    })
  })

  describe('Test super hero find all route', () => {
    it('Must return an 200 status and a fulfiled object with powers attribute ', async () =>{
      
      const response = await request(app).get(`/heroes/${0}/${1}`).set('Authorization',  adminUser.token)
      expect(response.status).toBe(200)
      expect(response.body.length).toBeGreaterThanOrEqual(1)
      expect(response.body[0]).toHaveProperty('id')
      expect(response.body[0]).toHaveProperty('name')
      expect(response.body[0]).toHaveProperty('alias')
      expect(response.body[0]).not.toHaveProperty('created_at')
      expect(response.body[0]).not.toHaveProperty('updated_at')
      expect(response.body[0].area).toHaveProperty('id')
      expect(response.body[0].area).toHaveProperty('name')
      expect(response.body[0].area).toHaveProperty('point')
      expect(response.body[0].area).toHaveProperty('radius')
      expect(response.body[0].area).not.toHaveProperty('created_at')
      expect(response.body[0].area).not.toHaveProperty('updated_at')
      expect(response.body[0]).toHaveProperty('powers')
      expect(response.body[0].powers.length).toBeGreaterThanOrEqual(1)
      expect(response.body[0].powers[0]).toHaveProperty('name')
      expect(response.body[0].powers[0]).toHaveProperty('description')
    })
  })

  describe('Test super hero find one route', () => {
    it('Must return an 200 status and a fulfiled object with powers attribute ', async () =>{
      
      const power = await SuperPower.create({ name: 'Fuse with Kamisama', description: 'Gives the true namekuseidin power' })
      const heroPayload = { 
          name: 'Picollo', 
          alias: 'Green fighter ET', 
          area: {
            name: 'Namekusei',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
          },
          powers: [{id: power.id, name: power.name, description: power.description}]
        }

      const heroResponse = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)

      const response = await request(app).get(`/heroes/${heroResponse.body.id}`).set('Authorization',  adminUser.token)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('name')
      expect(response.body).toHaveProperty('alias')
      expect(response.body).not.toHaveProperty('created_at')
      expect(response.body).not.toHaveProperty('updated_at')
      expect(response.body.area).toHaveProperty('id')
      expect(response.body.area).toHaveProperty('name')
      expect(response.body.area).toHaveProperty('point')
      expect(response.body.area).toHaveProperty('radius')
      expect(response.body.area).not.toHaveProperty('created_at')
      expect(response.body.area).not.toHaveProperty('updated_at')
      expect(response.body).toHaveProperty('powers')
      expect(response.body.powers).toHaveLength(1)
      expect(response.body.powers[0]).toHaveProperty('name', power.name)
      expect(response.body.powers[0]).toHaveProperty('description', power.description)
    })
  })

  describe('Test hero update route', () => {
    it('Must return an 200 status and a fulfiled object with powers attribute ', async () =>{
      
      const power = await SuperPower.create({ name: 'Galick Blazer', description: "Vegeta's energy sphere" })
      const vilainPower = await SuperPower.create({ name: 'Destroy The Planet!', description: 'Namekusei will explode in five LONG minutes' })

      const heroPayload = { 
        name: 'Vegeta', 
        alias: 'Sayan Prince', 
        area: {
            name: 'Planet Vegeta',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
        },
        powers: [{id: power.id, name: power.name, description: power.description}]
      }

      const heroUpdatePayload = { 
        name: 'Frieza', 
        alias: 'Freeza', 
        area: {
            name: 'Any Planet',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 6
        },
        powers: [{id: vilainPower.id, name: vilainPower.name, description: vilainPower.description}]
      }

      const heroResponse = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)
      const response = await request(app).put(`/heroes/${heroResponse.body.id}`).send(heroUpdatePayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body.id).not.toBeNull()
      expect(response.body).toHaveProperty('name', heroUpdatePayload.name)
      expect(response.body).toHaveProperty('alias', heroUpdatePayload.alias)
      expect(response.body).not.toHaveProperty('created_at')
      expect(response.body).not.toHaveProperty('updated_at')
      expect(response.body).toHaveProperty('area')
      expect(response.body.area).toHaveProperty('name', heroUpdatePayload.area.name)
      expect(response.body.area).toHaveProperty('point')
      expect(response.body.area).toHaveProperty('radius', heroUpdatePayload.area.radius)
      expect(response.body.area).not.toHaveProperty('created_at')
      expect(response.body.area).not.toHaveProperty('updated_at')
      expect(response.body).toHaveProperty('powers')
      expect(response.body.powers).toHaveLength(1)
      expect(response.body.powers[0]).toHaveProperty('name', vilainPower.name)
      expect(response.body.powers[0]).toHaveProperty('description', vilainPower.description)
    })
  })

  describe('Test super hero delete route', () => {

    it('Must return an 200 status and a fulfiled object with powers attribute ', async () =>{

      const power = await SuperPower.create({ name: 'Turtle Shell', description: "Helps on jump trainning" })

      const heroPayload = { 
        name: 'Master Kame', 
        alias: 'Jack Chun', 
        area: {
            name: 'Kame Island',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
        },
        powers: [{id: power.id, name: power.name, description: power.description}]
      }

      const heroResponse = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)
      const response = await request(app).delete(`/heroes/${heroResponse.body.id}`).set('Authorization', adminUser.token)

      const hero = await SuperHero.findById(heroResponse.body.id)
      const heroPowers = await HeroPower.findAll({where:{hero_id: heroResponse.body.id}})
      
      expect(response.status).toBe(200)
      expect(hero).toBeNull()
      expect(heroPowers).toHaveLength(0)
    })
  })
})