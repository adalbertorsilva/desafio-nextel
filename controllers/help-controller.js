const BaseController = require('./base-controller')
const ProtectionArea = require('../models').ProtectionArea

class HelpController extends BaseController {

  async helpCall (req, res ) {
    const areas = await ProtectionArea.findNotifiedAreas(req.body)
    const heroes = await Promise.all(areas.map(async area => await area.getHero()))
    const heroesResponse = heroes.map(hero => this.createHelpResponse(hero))

    res.status(200).send({heroes: heroesResponse})
  }

  createHelpResponse (hero) {
    return {
      id: hero.id,
      name: hero.name
    }
  }
}

module.exports = HelpController