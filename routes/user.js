const UserController = require('../controllers/user-controller')
const AuditController = require('../controllers/audit-controller')
const userController = new UserController()
const auditController = new AuditController()

module.exports = (app) => {
  app.post('/users', userController.validateUserPermition, userController.create, auditController.createEvent)
  app.get('/users', userController.validateUserPermition, userController.findAll)
  app.put('/users/:id', userController.validateUserPermition, userController.update, auditController.createEvent)
  app.get('/users/:id', userController.validateUserPermition, userController.find)
  app.delete('/users/:id', userController.validateUserPermition, userController.delete)
}