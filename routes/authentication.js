const AuthenticationController = require('../controllers/authentication-controller')
const authenticationController = new AuthenticationController()

module.exports = (app) => {
  app.get('/authenticate', authenticationController.handleAuthentication)
}
