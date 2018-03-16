const AuditEvent = require('../models').AuditEvent

/**
 * @class
 * Class responsible for handle audit events
 */
class AuditController {

  /**
   * @function
   * Persists an event model on database based
   * on request attributes passed by the previous middleware
   * and add o response
   * 
   * @param req http request
   * @param res http response
   */
  async createEvent (req, res) {
    const event = await AuditEvent.create(req.body.auditEventObject)
    res.status(req.body.responseStatus).send(req.body.responseObject)
  }

  /**
   * @function
   * Retrieve all audit events from database
   * and add to response
   * 
   * @param req http request
   * @param res http response
   */
  async findAll (req, res) {
    const events = await AuditEvent.findAll()
    res.status(200).send(events.map(event => event.responseObject()))
  }
}

module.exports = AuditController