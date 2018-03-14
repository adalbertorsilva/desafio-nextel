const BaseController = require('./base-controller')
const SuperHero = require('../models').SuperHero

class SuperHeroController extends BaseController{
  constructor () {
    super()
    this.ENTITY = 'SUPER HERO'      
  }

  async create (req, res, next) {
    const heroResponse = await SuperHero.create(req.body)
    this.configRequestBypass(req, heroResponse)
    next()
  }
}

module.exports = SuperHeroController