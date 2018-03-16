const AuditController = require('../controllers/audit-controller')
const SuperPowerController = require('../controllers/super-power-controller')
const auditController = new AuditController()
const superPowerController = new SuperPowerController()

module.exports = (app) => {
  app.post('/powers', superPowerController.validateUserPermition, superPowerController.create, auditController.createEvent)
  app.get('/powers/:offset/:limit', superPowerController.findAll)
  app.get('/powers/:id', superPowerController.find)
  app.put('/powers/:id', superPowerController.validateUserPermition, superPowerController.update, auditController.createEvent)
  app.delete('/powers/:id', superPowerController.validateUserPermition, superPowerController.delete, auditController.createEvent)
}