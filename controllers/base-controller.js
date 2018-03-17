const autoBind = require('auto-bind')
const sequelize = require('sequelize')
/**
 * class that contains common functions
 * for most controllers
 * 
 * @class
 */
class BaseController {
  constructor () {
    autoBind(this)
    this.CREATE_ACTION = 'CREATE'
    this.UPDATE_ACTION = 'UPDATE'
    this.DELETE_ACTION = 'DELETE'
  }

  /**
   * middleware function that redirects
   * request based on user's role
   * 
   * @param req - http request
   * @param res - http response
   * @param next - next middleware function
   */
  validateUserPermition (req, res, next) {
    req.body.requestUser.isAdmin() ? 
      next() : 
      res.status(403)
         .send({message: "User doesn't have permition do this action"})
  }

  /**
   * adds attributes to request body
   * for audit and response creation
   * 
   * @param req - http request
   * @param entity - current entity
   * @param responseObject [optional] - specific response object
   */
  async configRequestBypass (req, entity, responseObject) {
    req.body.auditEventObject = this.createAuditEventObject (req, entity)
    req.body.responseStatus = 200
    req.body.responseObject = await this.getResponseObject(entity, responseObject)
  }

  /**
   * return an object that represents
   * an audit event
   * 
   * @param req - http request
   * @param entity - current entity
   */
  createAuditEventObject (req, entity) {
    return {
      entity: this.ENTITY,
      entity_id: entity.id,
      username: req.body.requestUser.username,
      action: this.getAction(req)
    }
  }

  /**
   * returns string that represents
   * the action that is being executed
   * based on http method
   * 
   * @param req 
   */
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

  /**
   * converts empty string fields values into null
   * 
   * @param object - object to be formatted
   */
  convertEmptyFieldsToNull (object) {
    for (let key in object) {
      if (object[key] === '') {
        object[key] = null
      }
      
      if (key === 'area') {
        this.convertEmptyFieldsToNull(object[key])
      }
    }
  }

  /**
   * sends a friendly response based
   * on validation error type
   * 
   * @param error - error thrown
   * @param res - http response
   */
  createErrorResponse (error, res) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(403).send({message: `${this.getUniqueFieldMessage()} already exists`})
    }

    if (error.name === 'SequelizeDatabaseError') {
      res.status(403).send({message: `${this.getEmptyFieldMessage ()} can not be empty`})
    }
  }

  /**
   * Capitalizes word
   * @param word - word to be formatted
   */
  capitalizeWord (word) {
    return (word ? 
            word.toLowerCase() : 
            word).replace(/(?:^|\s)\S/g, letter =>  letter.toUpperCase())
  }

  /**
   * returns formatted string based entity
   */
  getUniqueFieldMessage () {
    if (this.ENTITY === 'SUPER HERO') {
      return 'Super Hero or Protection Area'
    }

    return this.capitalizeWord(this.ENTITY)
  }

  /**
   * returns formatted string based entity
   */
  getEmptyFieldMessage () {

    switch (this.ENTITY) {
      case 'USER':
        return 'Username or password'
      case 'SUPER HERO':
        return 'Super Hero or Protection Area'
      default:
        return this.capitalizeWord(this.ENTITY)
    }
  }
}

module.exports = BaseController