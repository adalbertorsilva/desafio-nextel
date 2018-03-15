const autoBind = require('auto-bind')

class BaseController {
  constructor () {
    autoBind(this)
    this.CREATE_ACTION = 'CREATE'
    this.UPDATE_ACTION = 'UPDATE'
    this.DELETE_ACTION = 'DELETE'
  }

  validateUserPermition (req, res, next) {
    req.body.requestUser.isAdmin() ? 
      next() : 
      res.status(403)
         .send({message: "User doesn't have permition do this action"})
  }

  async configRequestBypass (req, entity, responseObject) {
    req.body.auditEventObject = this.createAuditEventObject (req, entity)
    req.body.responseStatus = 200
    req.body.responseObject = await this.getResponseObject(entity, responseObject)
  }

  createAuditEventObject (req, entity) {
    return {
        entity: this.ENTITY,
        entity_id: entity.id,
        username: req.body.requestUser.username,
        action: this.getAction(req)
    }
  }

  getAction (req) {
    switch (req.method) {
        case 'POST':
            return this.CREATE_ACTION
        case 'PUT':
            return this.UPDATE_ACTION
        case 'DELETE':
            return this.DELETE_ACTION
    }
  }

  async getResponseObject (entity, responseObject) {
    return responseObject ? responseObject : await entity.responseObject()
  }
}

module.exports = BaseController