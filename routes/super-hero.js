const AuditController = require('../controllers/audit-controller')
const SuperHeroController = require('../controllers/super-hero-controller')
const auditController = new AuditController()
const superHeroController = new SuperHeroController()

module.exports = (app) => {
  app.post('/heroes', superHeroController.validateUserPermition, superHeroController.create, auditController.createEvent)
}