const {verify} = require('jsonwebtoken')
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
    const user  = new User()
    const userData = {
      username: req.body.username,
      password: user.generatePasswordHash(req.body.password)
    }

    const userResponse = await User.create(userData)
    const roles = await this.createRoles(req, userResponse.id)
    userResponse.roles = roles.map(role => role.responseObject())

    this.configRequestBypass(req, userResponse)
    next()
  }

  async findAll (req, res) {
    const users = await User.findAll()
    res.status(200).send(users)
  }

  async update (req, res, next) {
    const user  = new User()
    const roles = await this.createRoles(req, req.params.id)
    
    const userData = {
        username: req.body.username,
        password: user.generatePasswordHash(req.body.password),
    }

    const updatedUser = await User.update(userData, {
        where: { id: req.params.id },
        returning: true,
        plain: true
    })

    updatedUser[1].roles = roles.map(role => role.responseObject())
    this.configRequestBypass(req, updatedUser[1])
    next()
  }

  async find (req, res) {
    const user = await User.findById(req.params.id, {include:[{ model: Role, as:'roles' }]})
    user.roles = user.roles.map(role => role.responseObject())
    res.status(200).send(user.responseObject())
  }

  async delete (req, res, next) {
    const user = await User.findById(req.params.id)  
    await User.destroy({where:{id: req.params.id}})
    await UserRole.destroy({where:{user_id: req.params.id}})

    this.configRequestBypass(req, user, {message: 'User removed'})
    next()
  }

  async createRoles (req, user_id) {

    const lowerCaseParams = req.body.roles.map(role => role.toLowerCase())
    const roles = await Role.findAll()
    const filteredRoles = roles.filter(role => 
        lowerCaseParams.includes(role.name.toLowerCase()))

    const userRoles = filteredRoles.map(role => {
      return {user_id: user_id, role_id: role.id}
    })

    await UserRole.destroy({where:{user_id: user_id}})
    await UserRole.bulkCreate(userRoles)

    return filteredRoles
  }
}

module.exports = UserController