const BaseController = require('./base-controller')
const SuperPower = require('../models').SuperPower

/**
 * class that handles
 * super power's routes requests
 * 
 * @class
 */
class SuperPowerController extends BaseController {
  constructor () {
    super()
    this.ENTITY = 'SUPER POWER'      
  }

  /**
   * hanldes super power creation
   * 
   * @param req - http request
   * @param res - http response
   * @param next - next middleware function 
   */
  async create (req, res, next) {
    try {
      this.convertEmptyFieldsToNull(req.body)
      const powerResponse = await SuperPower.create(req.body)
      await this.configRequestBypass(req, powerResponse)
      next() 
    } catch (error) {
      this.createErrorResponse(error, res)
    }
  }

  /**
   * hanldes paginated search for super power based
   * on url params
   * 
   * @param req - http request
   * @param res - http response
   */
  async findAll (req, res) {
    const powers = await SuperPower.findAll({ offset: req.params.offset, limit: req.params.limit })
    res.status(200).send(powers.map(power => power.responseObject()))
  }

  /**
   * handles search for one specific super power
   * based on url params
   * 
   * @param req - http request
   * @param res - http response
   */
  async find (req, res) {
    const power = await SuperPower.findById(req.params.id)
    res.status(200).send(power.responseObject())
  }

  /**
   * hanldes super power update
   * 
   * @param req - http request
   * @param res - http response
   * @param next - next middleware function 
   */
  async update (req, res, next) {
    try {
      this.convertEmptyFieldsToNull(req.body)
      const power = await SuperPower.findById(req.params.id)
      const updatedPower = await power.updateAttributes(req.body)
      await this.configRequestBypass(req, updatedPower)
      next()
    } catch (error) {
      this.createErrorResponse(error, res)
    }
  }

   /**
   * handles super power removal based on
   * url params
   * 
   * @param req - http request
   * @param res - http response
   * @param next - next middleware function
   */
  async delete (req, res, next) {
    const power = await SuperPower.findById(req.params.id)
    const heroes = await power.getHeroes()

    if (heroes.length > 0) {
      return res.status(403).send({message: 'Super power can not be removed because it has a super hero binded to it'})
    }

    await SuperPower.destroy({where:{id: req.params.id}})
    await this.configRequestBypass(req, power, {message: 'Super power removed'})
    next()
  }
}

module.exports = SuperPowerController