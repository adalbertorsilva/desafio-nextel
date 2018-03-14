const BaseController = require('./base-controller')
const SuperHero = require('../models').SuperHero
const ProtectionArea = require('../models').ProtectionArea

class SuperHeroController extends BaseController{
  constructor () {
    super()
    this.ENTITY = 'SUPER HERO'      
  }

  async create (req, res, next) {
    const heroResponse = await SuperHero.create(req.body, {include:[{ model: ProtectionArea, as:'area' }]})
    this.configRequestBypass(req, heroResponse)
    next()
  }

  async findAll (req, res) {
    const heroes = await SuperHero.findAll({include:[{ model: ProtectionArea, as:'area' }]})
    res.status(200).send(heroes.map(hero => hero.responseObject()))
  }

  async find (req, res) {
    const hero = await SuperHero.findById(req.params.id, {include:[{ model: ProtectionArea, as:'area' }]})
    res.status(200).send(hero.responseObject())
  }

  async update (req, res, next) {
    const hero = await SuperHero.findById(req.params.id, {include:[{ model: ProtectionArea, as:'area' }]})
    const updatedHero = await hero.updateAttributes(req.body)
    this.configRequestBypass(req, updatedHero)
    next()
  }

  async delete (req, res, next) {
    const hero = await SuperHero.findById(req.params.id)  
    await SuperHero.destroy({where:{id: req.params.id}})
    this.configRequestBypass(req, hero, {message: 'Super hero removed'})
    next()
  }
}

module.exports = SuperHeroController