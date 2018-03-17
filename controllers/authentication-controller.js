const {JsonWebTokenError, sign, verify} = require('jsonwebtoken')
const autoBind = require('auto-bind')
const User = require('../models').User
const Role = require('../models').Role
const BaseController = require('./base-controller')
require('dotenv').config()

/**
 * @class
 * class responsible for handle athentication events
 */
class AuthenticationController extends BaseController{

   /**
   * Validates if it's a valid user by username and password 
   * passed on request
   * 
   * @param req http request
   * @param res http response
   */
  async handleAuthentication (req, res) {

    const user = await User.find({where: {username: req.body.username}})

    if (user === null) {
      return res.status(403).send({message: 'User not found!'})
    }

    user.validatePassword(req.body.password) ? res.status(200).send({token: this.generateToken(user)}) : res.status(403).send({message: 'Invalid password!'})
  }

  /**
   * gets token no 'Authorization' header
   * and check if it's valid
   * 
   * @param req - http request
   * @param res - http response
   * @param next - next middleware function 
   */
  async handleTokenValidation (req, res, next) {

    const decodedToken = this.decodeToken(req.get('Authorization'))
    if (decodedToken.isValid) {
      req.body.requestUser = await User.findById(decodedToken.user_id, {include:[{ model: Role, as:'roles' }]})
      next()
    } else {
      res.status(403).send({message: "Token is not valid"})
    }
  }

  /**
   * generates a jwt token based with an user id attached to it
   * 
   * @param user - requesting user
   */
  generateToken (user) {
    return sign({user_id: user.id}, process.env.TOKEN_SECRET)
  }

  /**
   * check if token is valid
   * 
   * @param token - jwt token
   */
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