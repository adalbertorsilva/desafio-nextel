const AuditEvent = require('../models').AuditEvent

class AuditController {

  async createEvent (req, res) {
    const event = await AuditEvent.create(req.body.auditEventObject)
    res.status(req.body.responseStatus).send(req.body.responseObject)
  }

  async findAll (req, res) {
    const events = await AuditEvent.findAll()
    res.status(200).send(events.map(event => event.responseObject()))
  }
}

module.exports = AuditController