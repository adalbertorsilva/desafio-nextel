const {JsonWebTokenError, sign, verify} = require('jsonwebtoken')
const autoBind = require('auto-bind')
const User = require('../models').User
const Role = require('../models').Role
require('dotenv').config()

class AuthenticationController {
  constructor () {
    autoBind(this)
  }

  async handleAuthentication (req, res) {

    const user = await User.find({where: {username: req.body.username}})

    if (user === null) {
      return res.status(403).send({message: 'User not found!'})
    }

    user.validatePassword(req.body.password) ? res.status(200).send({token: this.generateToken(user)}) : res.status(403).send({message: 'Invalid password!'})
  }

  async handleTokenValidation (req, res, next) {

    const decodedToken = this.decodeToken(req.get('Authorization'))
    if (decodedToken.isValid) {
      req.body.requestUser = await User.findById(decodedToken.user_id, {include:[{ model: Role, as:'roles' }]})
      next()
    } else {
      res.status(403).send({message: "Token is not valid"})
    }
  }

  generateToken (user) {
    return sign({user_id: user.id}, process.env.TOKEN_SECRET)
  }

  decodeToken (token) {
    let decodedToken = {}
    try {
      decodedToken = verify(token, process.env.TOKEN_SECRET)
      decodedToken.isValid = true   
    } catch (JsonWebTokenError) {
      decodedToken.isValid = false
    }

    return decodedToken
  }

}

module.exports = AuthenticationController