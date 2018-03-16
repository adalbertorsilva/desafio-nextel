const AuditController = require('../controllers/audit-controller')
const SuperHeroController = require('../controllers/super-hero-controller')
const auditController = new AuditController()
const superHeroController = new SuperHeroController()

module.exports = (app) => {
  app.post('/heroes', superHeroController.validateUserPermition, superHeroController.create, auditController.createEvent)
  app.get('/heroes/:offset/:limit', superHeroController.findAll)
  app.get('/heroes/:id', superHeroController.find)
  app.put('/heroes/:id', superHeroController.validateUserPermition, superHeroController.update, auditController.createEvent)
  app.delete('/heroes/:id', superHeroController.validateUserPermition, superHeroController.delete, auditController.createEvent)
}