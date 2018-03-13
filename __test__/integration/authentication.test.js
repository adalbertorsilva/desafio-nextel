const request = require('supertest')
const app = require('../../app')

describe('Authentication', () => {
  describe('Test user token generation', () => {
    it('Must generate a token for the user', async () =>{
      const response = await request(app).get('/authenticate')
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(response.body.token).not.toBeNull()
    })
  })

  describe('Test user token validation', () => {
    it('Must return a 403 status if token is not valid', async () =>{
      const response = await request(app).get('/users')
      expect(response.status).toBe(403)
    })
  })
})