const {JsonWebTokenError, sign, verify} = require('jsonwebtoken')
const autoBind = require('auto-bind')
const User = require('../models').User
const Role = require('../models').Role
require('dotenv').config()

class AuthenticationController {
  constructor () {
    autoBind(this)
  }

  handleAuthentication (req, res) {
    res.status(200).send({token: this.generateToken()})
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

  generateToken () {
    return sign({}, process.env.TOKEN_SECRET)
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