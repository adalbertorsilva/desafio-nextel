const {verify} = require('jsonwebtoken')
const User = require('../models').User
const Role = require('../models').Role
const UserRole = require('../models').UserRole
const autoBind = require('auto-bind')

class UserController {
  
  constructor () {
    autoBind(this)
    this.CREATED_STATUS = 201
    this.OK_STATUS = 200
    this.ACTION_FORBIDDEN_STATUS = 403
    this.CREATE_ACTION = 'CREATE'
    this.UPDATE_ACTION = 'UPDATE'
    this.DELETE_ACTION = 'DELETE'
  }

  validateUserPermition (req, res, next) {
    this.requestUser = req.body.requestUser
    this.requestUser.isAdmin() ? next() : res.status(this.ACTION_FORBIDDEN_STATUS).send({message: "User doesn't have permition do this action"})
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

    req.body.auditEventObject =this.createAuditEventObject (this.CREATE_ACTION, userResponse)
    req.body.responseStatus = this.CREATED_STATUS
    req.body.responseObject = userResponse.responseObject()
    next()
  }

  async findAll (req, res) {
    const users = await User.findAll()
    res.status(this.OK_STATUS).send(users)
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

    req.body.auditEventObject =this.createAuditEventObject (this.UPDATE_ACTION, updatedUser[1])
    req.body.responseStatus = this.OK_STATUS
    req.body.responseObject = updatedUser[1].responseObject()
    next()
  }

  async find (req, res) {
    const user = await User.findById(req.params.id, {include:[{ model: Role, as:'roles' }]})
    user.roles = user.roles.map(role => role.responseObject())
    res.status(this.OK_STATUS).send(user.responseObject())
  }

  async delete (req, res, next) {
    const user = await User.findById(req.params.id)  
    await User.destroy({where:{id: req.params.id}})
    await UserRole.destroy({where:{user_id: req.params.id}})
    req.body.auditEventObject =this.createAuditEventObject (this.DELETE_ACTION, user)
    req.body.responseStatus = this.OK_STATUS
    req.body.responseObject = {message: 'User removed'}
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

  createAuditEventObject (action, user) {
    return {
        entity: 'User',
        entity_id: user.id,
        username: this.requestUser.username,
        action
      }
  }
}

module.exports = UserController