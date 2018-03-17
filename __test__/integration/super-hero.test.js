const request = require('supertest')
const app = require('../../app')
const User = require('../../models').User
const Role = require('../../models').Role
const UserRole = require('../../models').UserRole
const SuperHero = require('../../models').SuperHero
const jwt = require('jsonwebtoken')
require('dotenv').config()

describe('Super Hero', () => {
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
    const standardUser = await User.create({username: 'superherostandarduser', password: 'standardpassword'})
    await UserRole.create({user_id: standardUser.id, role_id: standardRole.id})
    const userToken = jwt.sign({user_id: standardUser.id}, process.env.TOKEN_SECRET)

    standardUser.token = userToken

    return standardUser
  }

  const createAdminUser = async () => {
    const adminUser =  await User.create({username:'superheroadminuser', password:'standardpswd'})
    await UserRole.create({user_id: adminUser.id, role_id: adminRole.id})
    const userToken = jwt.sign({user_id: adminUser.id}, process.env.TOKEN_SECRET)

    adminUser.token = userToken

    return adminUser
  }

  describe('Test hero creation route', () => {
    it('Must return an 403 status if user is not Admin ', async () => {
      
        const heroPayload = { name: 'Superman', alias: 'Clark Kent' }

        const response = await request(app).post('/heroes').send(heroPayload).set('Authorization', standardUser.token)

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () => {
      
      const heroPayload = { 
          name: 'Superman', 
          alias: 'Clark Kent', 
          area: {
            name: 'Metropolis',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
          }
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
    })

    it('Must return an 403 status and a fulfiled object with an error message ', async () => {
      
      const heroPayload = { 
          name: 'Superman', 
          alias: 'Clark Kent', 
          area: {
            name: 'Metropolis',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
          }
        }

      const response = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "Super Hero or Protection Area already exists")
    })

    it('Must return an 403 status and a fulfiled object with an error message when hero name is empty', async () => {
      
      const heroPayload = { 
          name: '', 
          alias: 'Clark Kent', 
          area: {
            name: 'Small Vile',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
          }
        }

      const response = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "Super Hero or Protection Area can not be empty")
    })

    it('Must return an 403 status and a fulfiled object with an error message when area name is empty', async () => {
      
      const heroPayload = { 
          name: 'Return Of Superman', 
          alias: 'Clark Kent', 
          area: {
            name: '',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
          }
        }

      const response = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "Super Hero or Protection Area can not be empty")
    })
  })

  describe('Test super hero find all route', () => {
    it('Must return an 200 status and a fulfiled object if user is Admin ', async () => {
      
      const response = await request(app).get(`/heroes/${0}/${1}`).set('Authorization',  adminUser.token)
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(1)
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
    })

    it('Must return an 200 status and a fulfiled object if user is Standard ', async () => {
      
        const response = await request(app).get(`/heroes/${0}/${1}`).set('Authorization',  standardUser.token)
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(1)
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
    })
  })

  describe('Test super hero find one route', () => {
    it('Must return an 200 status and a fulfiled object if user is Admin ', async () => {

      const heroPayload = { 
          name: 'Batman', 
          alias: 'Bruce Wayne', 
          area: {
            name: 'Gotham City',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
          }
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
    })

    it('Must return an 200 status and a fulfiled object if user is Standard ', async () => {

        const heroPayload = { 
            name: 'Wonder Woman', 
            alias: 'Princess Diana of Themyscira', 
            area: {
                name: 'Themyscira',
                point: { type: 'Point', coordinates: [40.671725,-73.945351]},
                radius: 8.5
            }
        }

        const heroResponse = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)
        const response = await request(app).get(`/heroes/${heroResponse.body.id}`).set('Authorization',  standardUser.token)
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
    })
  })

  describe('Test hero update route', () => {

    it('Must return an 403 status if user is not Admin ', async () => {

        const heroPayload = { 
            name: 'Green Lantern', 
            alias: 'Hal Jordan', 
            area: {
                name: 'Chicago',
                point: { type: 'Point', coordinates: [40.671725,-73.945351]},
                radius: 8.5
            }
        }

        const heroResponse = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)
        const response = await request(app).put(`/heroes/${heroResponse.body.id}`).send(heroPayload).set('Authorization', standardUser.token)

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () => {

      const heroPayload = { 
        name: 'Flash', 
        alias: 'Jay Garrick', 
        area: {
            name: 'Justice League HC',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
        }
      }

      const heroUpdatePayload = { 
        name: 'Aquaman', 
        alias: 'Arthur Curry II', 
        area: {
            name: 'Atlantis',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 6
        }
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
    })

    it('Must return an 403 status and a fulfiled object with an error message ', async () => {

      const heroPayload = { 
        name: 'some hero', 
        alias: 'some name ', 
        area: {
            name: 'some place',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
        }
      }

      const otherHeroPayload = { 
        name: 'other hero', 
        alias: 'other name ', 
        area: {
            name: 'other place',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
        }
      }

      const heroUpdatePayload = { 
        name: 'other hero', 
        alias: 'Arthur Curry II', 
        area: {
            name: 'Atlantis',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 6
        }
      }

      await request(app).post('/heroes').send(otherHeroPayload).set('Authorization', adminUser.token)
      const heroResponse = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)
      const response = await request(app).put(`/heroes/${heroResponse.body.id}`).send(heroUpdatePayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "Super Hero or Protection Area already exists")
    })

    it('Must return an 403 status and a fulfiled object with an error message ', async () => {

      const heroPayload = { 
        name: 'a hero', 
        alias: 'some name ', 
        area: {
            name: 'a place',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
        }
      }

      const otherHeroPayload = { 
        name: 'another hero', 
        alias: 'other name ', 
        area: {
            name: 'another place',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
        }
      }

      const heroUpdatePayload = { 
        name: 'a different name', 
        alias: 'Arthur Curry II', 
        area: {
            name: 'another place',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 6
        }
      }

      await request(app).post('/heroes').send(otherHeroPayload).set('Authorization', adminUser.token)
      const heroResponse = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)
      const response = await request(app).put(`/heroes/${heroResponse.body.id}`).send(heroUpdatePayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "Super Hero or Protection Area already exists")
    })

    it('Must return an 403 status and a fulfiled object with an error message when hero name is empty', async () => {

      const heroPayload = { 
        name: 'my hero', 
        alias: 'some name ', 
        area: {
            name: 'my place',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
        }
      }

      const heroUpdatePayload = { 
        name: '', 
        alias: 'Arthur Curry II', 
        area: {
            name: 'empty place',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 6
        }
      }

      const heroResponse = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)
      const response = await request(app).put(`/heroes/${heroResponse.body.id}`).send(heroUpdatePayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "Super Hero or Protection Area can not be empty")
    })

    it('Must return an 403 status and a fulfiled object with an error message when area name is empty', async () => {

      const heroPayload = { 
        name: 'strange hero', 
        alias: 'some name ', 
        area: {
            name: 'strange place',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
        }
      }

      const heroUpdatePayload = { 
        name: 'nice hero', 
        alias: 'Arthur Curry II', 
        area: {
            name: '',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 6
        }
      }

      const heroResponse = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)
      const response = await request(app).put(`/heroes/${heroResponse.body.id}`).send(heroUpdatePayload).set('Authorization', adminUser.token)

      expect(response.status).toBe(403)
      expect(response.body).toHaveProperty('message', "Super Hero or Protection Area can not be empty")
    })
  })

  describe('Test hero delete route', () => {

    it('Must return an 403 status if user is not Admin ', async () => {

        const heroPayload = { 
            name: 'Nightwing', 
            alias: 'Dick Grayson', 
            area: {
                name: 'Bludraven',
                point: { type: 'Point', coordinates: [40.671725,-73.945351]},
                radius: 8.5
            }
        }

        const heroResponse = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)
        const response = await request(app).delete(`/heroes/${heroResponse.body.id}`).set('Authorization', standardUser.token)

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message', "User doesn't have permition do this action")
    })

    it('Must return an 200 status and a fulfiled object if user is Admin ', async () => {

      const heroPayload = { 
        name: 'Red Hood', 
        alias: 'Jason Todd', 
        area: {
            name: 'Pitsburg',
            point: { type: 'Point', coordinates: [40.671725,-73.945351]},
            radius: 8.5
        }
      }

      const heroResponse = await request(app).post('/heroes').send(heroPayload).set('Authorization', adminUser.token)
      const response = await request(app).delete(`/heroes/${heroResponse.body.id}`).set('Authorization', adminUser.token)

      const hero = await SuperHero.findById(heroResponse.body.id)

      expect(response.status).toBe(200)
      expect(hero).toBeNull()
    })
  })
})