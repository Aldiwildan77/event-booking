const jwt = require('jsonwebtoken')
const config = require('../config/config').dev.auth

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    req.isAuth = false
    return next()
  }

  const token = authHeader.split(' ')[1]
  if (!token || token === '') {
    req.isAuth = false
    return next()
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, config.key)
  } catch (error) {
    req.isAuth = false
    next()
  }

  if (!decodedToken) {
    req.isAuth = false
    return next()
  }

  req.isAuth = true
  req.userId = decodedToken.userId
  next()
}