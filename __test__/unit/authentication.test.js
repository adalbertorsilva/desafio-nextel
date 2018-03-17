const AuthenticationController = require('../../controllers/authentication-controller')
const User = require('../../models').User

describe('Authentication', () => {
  describe('Test token generation', () => {
    it('Must return a string token', async () =>{

        const user = new User()
        const authenticationController = new AuthenticationController()
        const token = authenticationController.generateToken(user)
        expect(token).not.toBeNull()
        expect(typeof token).toBe('string')
    })

    it('Must return false when the token is not valid', () =>{
        const authenticationController = new AuthenticationController()
        const token = 'notvalidtoken'
        expect(authenticationController.decodeToken(token).isValid).toBeFalsy()
    })

    it('Must return true when the token not valid', async () =>{
        const user = new User()
        const authenticationController = new AuthenticationController()
        const token = authenticationController.generateToken(user)
        const decodedToken = authenticationController.decodeToken(token)
        expect(decodedToken.isValid).toBeTruthy()
        expect(decodedToken).toHaveProperty('user_id')
    })
  })
})