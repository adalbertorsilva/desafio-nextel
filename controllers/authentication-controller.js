const {JsonWebTokenError, sign, verify} = require('jsonwebtoken')
const autoBind = require('auto-bind')
require('dotenv').config()

class AuthenticationController {
  constructor () {
    autoBind(this)
  }

  handleAuthentication (req, res) {
    res.status(200).send({token: this.generateToken()})
  }

  generateToken () {
    return sign({}, process.env.TOKEN_SECRET)
  }

  validateToken (token) {
    try {
      verify(token, process.env.TOKEN_SECRET)
      return true   
    } catch (JsonWebTokenError) {
      return false
    }
  }

}

module.exports = AuthenticationController