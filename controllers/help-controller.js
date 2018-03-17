const BaseController = require('./base-controller')
const ProtectionArea = require('../models').ProtectionArea

/**
 * class that handles
 * user's routes requests
 * 
 * @class
 */
class HelpController extends BaseController {

  /**
   * handles a help request
   * 
   * @param req - http request
   * @param res - http response
   */
  async helpCall (req, res ) {
    const areas = await ProtectionArea.findNotifiedAreas(req.body)
    const heroes = await Promise.all(areas.map(async area => await area.getHero()))
    const heroesResponse = heroes.map(hero => this.createHelpResponse(hero))

    res.status(200).send({heroes: heroesResponse})
  }

  /**
   * creates an object based on hero's attributes
   * 
   * @param hero - hero entity
   */
  createHelpResponse (hero) {
    return {
      id: hero.id,
      name: hero.name
    }
  }
}

module.exports = HelpController