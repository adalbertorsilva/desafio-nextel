const AuthenticationController = require('../../controllers/authentication-controller')

describe('Authentication', () => {
  describe('Test token generation', () => {
    it('Must rturn a string token', () =>{
        const authenticationController = new AuthenticationController()
        const token = authenticationController.generateToken()
        expect(token).not.toBeNull()
        expect(typeof token).toBe('string')
    })

    it('Must return false when the token is not valid', () =>{
        const authenticationController = new AuthenticationController()
        const token = 'notvalidtoken'
        expect(authenticationController.decodeToken(token).isValid).toBeFalsy()
    })

    it('Must return true when the token not valid', () =>{
        const authenticationController = new AuthenticationController()
        const token = authenticationController.generateToken()
        expect(authenticationController.decodeToken(token).isValid).toBeTruthy()
    })
  })
})