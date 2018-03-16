const User = require('../models').User
const Role = require('../models').Role
const UserRole = require('../models').UserRole
const BaseController = require('./base-controller')

class UserController extends BaseController {

  constructor () {
    super()
    this.ENTITY = 'USER'
  }

  async create (req, res, next) {
    const userResponse = await User.create(req.body)
    await userResponse.setRoles(this.getUserRoles(req))
    await this.configRequestBypass(req, userResponse)
    next()
  }

  async findAll (req, res) {
    const users = await User.findAll({offset: req.params.offset, limit: req.params.limit})
    const usersResponse = await Promise.all(users.map(async user => await this.getResponseObject(user)))
    res.status(200).send(usersResponse)
  }

  async update (req, res, next) {
    const user = await User.findById(req.params.id, {include:[{ model: Role, as:'roles' }]})
    await user.setRoles(this.getUserRoles(req))
    const updatedUser = await user.updateAttributes(req.body)
    await this.configRequestBypass(req, updatedUser)
    next()
  }

  async find (req, res) {
    const user = await User.findById(req.params.id, {include:[{ model: Role, as:'roles' }]})
    res.status(200).send(await user.responseObject())
  }

  async delete (req, res, next) {
    const user = await User.findById(req.params.id)
    user.setRoles([])  
    await User.destroy({where:{id: req.params.id}})
    await this.configRequestBypass(req, user, {message: 'User removed'})
    next()
  }

  getUserRoles (req) {
    return req.body.roles ? req.body.roles.map(role => role.id) : []
  }
}

module.exports = UserController