const User = require('../models').User
const Role = require('../models').Role
const UserRole = require('../models').UserRole
const BaseController = require('./base-controller')

/**
 * class that handles
 * user's routes requests
 * 
 * @class
 */
class UserController extends BaseController {

  constructor () {
    super()
    this.ENTITY = 'USER'
  }

  /**
   * hanldes user creation
   * 
   * @param req - http request
   * @param res - http response
   * @param next - next middleware function 
   */
  async create (req, res, next) {
    try {
      this.convertEmptyFieldsToNull(req.body)
      const userResponse = await User.create(req.body)
      await userResponse.setRoles(this.getUserRoles(req))
      await this.configRequestBypass(req, userResponse)
      next() 
    } catch (error) {
      this.createErrorResponse(error, res)
    }
  }

  /**
   * hanldes paginated search for user based
   * on url params
   * 
   * @param req - http request
   * @param res - http response
   */
  async findAll (req, res) {
    const users = await User.findAll({offset: req.params.offset, limit: req.params.limit})
    const usersResponse = await Promise.all(users.map(async user => await this.getResponseObject(user)))
    res.status(200).send(usersResponse)
  }

  /**
   * hanldes user update
   * 
   * @param req - http request
   * @param res - http response
   * @param next - next middleware function 
   */
  async update (req, res, next) {
    try {
      this.convertEmptyFieldsToNull(req.body)
      const user = await User.findById(req.params.id, {include:[{ model: Role, as:'roles' }]})
      await user.setRoles(this.getUserRoles(req))
      const updatedUser = await user.updateAttributes(req.body)
      await this.configRequestBypass(req, updatedUser)
      next()
    } catch (error) {
      this.createErrorResponse(error, res)
    }
  }

  /**
   * handles search for one specific user
   * based on url params
   * 
   * @param req - http request
   * @param res - http response
   */
  async find (req, res) {
    const user = await User.findById(req.params.id, {include:[{ model: Role, as:'roles' }]})
    res.status(200).send(await user.responseObject())
  }

   /**
   * handles user removal based on
   * url params
   * 
   * @param req - http request
   * @param res - http response
   * @param next - next middleware function
   */
  async delete (req, res, next) {
    const user = await User.findById(req.params.id)
    user.setRoles([])  
    await User.destroy({where:{id: req.params.id}})
    await this.configRequestBypass(req, user, {message: 'User removed'})
    next()
  }

  /**
   * create an array of ids from an array of roles
   * 
   * @param req - http request
   */
  getUserRoles (req) {
    return req.body.roles ? req.body.roles.map(role => role.id) : []
  }
}

module.exports = UserController