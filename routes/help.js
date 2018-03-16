const HelpController = require('../controllers/help-controller')
const helpController = new HelpController()

module.exports = (app) => {
  app.post('/help', helpController.helpCall)
}