const AuditController = require('../controllers/audit-controller')
const auditController = new AuditController()

module.exports = (app) => {
  app.get('/audit_events', auditController.findAll)
}