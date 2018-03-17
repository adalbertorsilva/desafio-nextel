const BaseController = require('./base-controller')
const SuperHero = require('../models').SuperHero
const SuperPower = require('../models').SuperPower
const ProtectionArea = require('../models').ProtectionArea
const HeroPower = require('../models').HeroPower

/**
 * class that handles
 * super hero's routes requests
 * 
 * @class
 */
class SuperHeroController extends BaseController{
  constructor () {
    super()
    this.ENTITY = 'SUPER HERO'      
  }

  /**
   * hanldes super hero creation
   * 
   * @param req - http request
   * @param res - http response
   * @param next - next middleware function 
   */
  async create (req, res, next) {
    try {
      this.convertEmptyFieldsToNull(req.body)
      const heroResponse = await SuperHero.create(req.body, {include:[{ model: ProtectionArea, as:'area' }]})
      await heroResponse.setPowers(this.getHeroPowers(req))
      await this.configRequestBypass(req, heroResponse)
      next() 
    } catch (error) {
      this.createErrorResponse(error, res)
      // res.status(403).send({message:'Super hero or area already exists'})
    }
  }

  /**
   * hanldes paginated search for super hero based
   * on url params
   * 
   * @param req - http request
   * @param res - http response
   */
  async findAll (req, res) {
    const heroes = await SuperHero.findAll({include:[{ model: ProtectionArea, as:'area' }], offset: req.params.offset, limit: req.params.limit },)
    const heroesResponse = await Promise.all(heroes.map(async hero => await this.getResponseObject(hero)))
    res.status(200).send(heroesResponse)
  }

  /**
   * handles search for one specific super hero
   * based on url params
   * 
   * @param req - http request
   * @param res - http response
   */
  async find (req, res) {
    const hero = await SuperHero.findById(req.params.id, {include:[{ model: ProtectionArea, as:'area' }]})
    res.status(200).send(await hero.responseObject())
  }

  /**
   * hanldes super hero update
   * 
   * @param req - http request
   * @param res - http response
   * @param next - next middleware function 
   */
  async update (req, res, next) {
    try {
      this.convertEmptyFieldsToNull(req.body)
      const hero = await SuperHero.findById(req.params.id, {include:[{ model: ProtectionArea, as:'area' }]})
      await hero.setPowers(this.getHeroPowers(req))
      if (req.body.area) {
        await hero.area.updateAttributes(req.body.area)
      }
      const updatedHero = await hero.updateAttributes(req.body)
      await this.configRequestBypass(req, updatedHero)
      next()
    } catch (error) {
      this.createErrorResponse(error, res)
    }
    
  }

  /**
   * handles super hero removal based on
   * url params
   * 
   * @param req - http request
   * @param res - http response
   * @param next - next middleware function
   */
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