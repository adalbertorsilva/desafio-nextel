const request = require('supertest')
const app = require('../../app')
const User = require('../../models').User
const Role = require('../../models').Role
const UserRole = require('../../models').UserRole
const SuperHero = require('../../models').SuperHero
const ProtectionArea = require('../../models').ProtectionArea
const jwt = require('jsonwebtoken')

describe('Help me', async () => {

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
    const standardUser = await User.create({username: 'standarduser', password: 'standardpassword'})
    await UserRole.create({user_id: standardUser.id, role_id: standardRole.id})
    const userToken = jwt.sign({user_id: standardUser.id}, process.env.TOKEN_SECRET)

    standardUser.token = userToken

    return standardUser
  }

  const createAdminUser = async () => {
    const adminUser =  await User.create({username:'auditadminuser', password:'standardpswd'})
    await UserRole.create({user_id: adminUser.id, role_id: adminRole.id})
    const userToken = jwt.sign({user_id: adminUser.id}, process.env.TOKEN_SECRET)

    adminUser.token = userToken

    return adminUser
  }
  describe('Test help call', () => {

    it('Must return a 200 status and a list of heroes', async () =>{

        const spidermanPayload = { 
          name: 'Spiderman', 
          alias: 'Peter Parker',
          area: {
            name: 'Place 1',
            point: { type: 'Point', coordinates: [37.768949,-122.460652]},
            radius: 8.5
          }
        }

        const hulkPayload = { 
          name: 'Hulk', 
          alias: 'Bruce Banner',
          area: {
            name: 'Place 2',
            point: { type: 'Point', coordinates: [37.762910,-122.457777]},
            radius: 8.5
          }
        }

        const captainAmericaPayload = { 
          name: 'Captain America', 
          alias: 'Steve Rodgers',
            area: {
              name: 'Place 3',
              point: { type: 'Point', coordinates: [37.777293,-122.450653]},
              radius: 8.5
            }
        }

        const ironManPayload = { 
          name: 'Iron Man', 
          alias: 'Tony Stark',
            area: {
              name: 'Place 4',
              point: { type: 'Point', coordinates: [37.776038,-122.452627]},
              radius: 8.5
            }
        }

        const blackWidowPayload = { 
            name: 'Black Widow', 
            alias: 'Natasha Romanova',
              area: {
                name: 'Place 5',
                point: { type: 'Point', coordinates: [37.773189,-122.458978]},
                radius: 8.5
              }
          }

          const wolverinePayload = { 
            name: 'Wolverine', 
            alias: 'John Logan',
              area: {
                name: 'Place 6',
                point: { type: 'Point', coordinates: [37.772070,-122.468591]},
                radius: 8.5
              }
          }

          const blackPantherPayload = { 
            name: 'Black Panther', 
            alias: "Prince T'Challa",
              area: {
                name: 'Place 7',
                point: { type: 'Point', coordinates: [37.770577,-122.466102]},
                radius: 8.5
              }
          }

          const soldierPayload = { 
            name: 'Invernal Soldier', 
            alias: 'Bucky Barnes',
              area: {
                name: 'Place 8',
                point: { type: 'Point', coordinates: [37.768847,-122.475672]},
                radius: 8.5
              }
          }

          const thorPayload = { 
            name: 'Thor', 
            alias: 'Thor',
              area: {
                name: 'Place 9',
                point: { type: 'Point', coordinates: [37.777158,-122.465201]},
                radius: 8.5
              }
          }

        const helpPayload = {
          longitude: 37.771629,
          latitude: -122.463828
        }

        const spidermanResponse = await request(app).post('/heroes').send(spidermanPayload).set('Authorization', adminUser.token)
        const hulkResponse = await request(app).post('/heroes').send(hulkPayload).set('Authorization', adminUser.token)
        const americaResponse = await request(app).post('/heroes').send(captainAmericaPayload).set('Authorization', adminUser.token)
        const ironManResponse = await request(app).post('/heroes').send(ironManPayload).set('Authorization', adminUser.token)
        const blackWidowResponse = await request(app).post('/heroes').send(blackWidowPayload).set('Authorization', adminUser.token)
        const wolverineResponse = await request(app).post('/heroes').send(wolverinePayload).set('Authorization', adminUser.token)
        const blackPantherResponse = await request(app).post('/heroes').send(blackPantherPayload).set('Authorization', adminUser.token)
        const soldierResponse = await request(app).post('/heroes').send(soldierPayload).set('Authorization', adminUser.token)
        const thorResponse = await request(app).post('/heroes').send(thorPayload).set('Authorization', adminUser.token)

        const response = await request(app).post('/help').send(helpPayload).set('Authorization', standardUser.token)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('heroes')
        expect(response.body.heroes).toHaveLength(8)
        expect(response.body.heroes[0]).toHaveProperty('id')
        expect(response.body.heroes[0]).toHaveProperty('name')

    })
  })
})