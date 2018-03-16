const BaseController = require('./base-controller')
const SuperHero = require('../models').SuperHero
const SuperPower = require('../models').SuperPower
const ProtectionArea = require('../models').ProtectionArea
const HeroPower = require('../models').HeroPower

class SuperHeroController extends BaseController{
  constructor () {
    super()
    this.ENTITY = 'SUPER HERO'      
  }

  async create (req, res, next) {
    const heroResponse = await SuperHero.create(req.body, {include:[{ model: ProtectionArea, as:'area' }]})
    await heroResponse.setPowers(this.getHeroPowers(req))
    await this.configRequestBypass(req, heroResponse)
    next()
  }

  async findAll (req, res) {
    const heroes = await SuperHero.findAll({include:[{ model: ProtectionArea, as:'area' }], offset: req.params.offset, limit: req.params.limit },)
    const heroesResponse = await Promise.all(heroes.map(async hero => await this.getResponseObject(hero)))
    res.status(200).send(heroesResponse)
  }

  async find (req, res) {
    const hero = await SuperHero.findById(req.params.id, {include:[{ model: ProtectionArea, as:'area' }]})
    res.status(200).send(await hero.responseObject())
  }

  async update (req, res, next) {
    const hero = await SuperHero.findById(req.params.id, {include:[{ model: ProtectionArea, as:'area' }]})
    await hero.setPowers(this.getHeroPowers(req))
    const updatedHero = await hero.updateAttributes(req.body)
    await this.configRequestBypass(req, updatedHero)
    next()
  }

  async delete (req, res, next) {
    const hero = await SuperHero.findById(req.params.id)  
    hero.setPowers([])
    await SuperHero.destroy({where:{id: req.params.id}})
    await this.configRequestBypass(req, hero, {message: 'Super hero removed'})
    next()
  }

  getHeroPowers (req) {
    return req.body.powers ? req.body.powers.map(power => power.id) : []
  }
}

module.exports = SuperHeroController