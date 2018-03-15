const AuthenticationController = require('../controllers/authentication-controller')
const authenticationController = new AuthenticationController()

module.exports = (app) => {
  require('./authentication')(app)
  app.use(authenticationController.handleTokenValidation)
  require('./user')(app)
  require('./audit-events')(app)
  require('./super-hero')(app)
  require('./super-power')(app)
}