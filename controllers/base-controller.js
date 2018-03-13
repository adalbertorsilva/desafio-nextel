const autoBind = require('auto-bind')

class BaseController {
  constructor () {
    autoBind(this)
    this.OK_STATUS = 200
    this.ACTION_FORBIDDEN_STATUS = 403
    this.CREATE_ACTION = 'CREATE'
    this.UPDATE_ACTION = 'UPDATE'
    this.DELETE_ACTION = 'DELETE'
  }

  configRequestBypass (req, entity, responseObject) {
    req.body.auditEventObject = this.createAuditEventObject (this.getAction(req), entity)
    req.body.responseStatus = this.OK_STATUS
    req.body.responseObject = this.getResponseObject(entity, responseObject)
  }

  createAuditEventObject (action, entity) {
    return {
        entity: this.ENTITY,
        entity_id: entity.id,
        username: this.requestUser.username,
        action
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

  getResponseObject (entity, responseObject) {
    return responseObject ? responseObject : entity.responseObject()
  }
}

module.exports = BaseController