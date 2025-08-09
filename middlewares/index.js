const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS)
const APP_SECRET = process.env.APP_SECRET

exports.hashPassword = async (password) => {
  let hash = await bcrypt.hash(password, SALT_ROUNDS)

  return hash
}

exports.comparePassword = async (password, passwordDigest) => {
  let matched = await bcrypt.compare(password, passwordDigest)
  return matched
}

exports.createToken = (payload) => {
  let token = jwt.sign(payload, APP_SECRET)
  return token
}

exports.stripToken = (req, res, next) => {
  try {
    const token = req.headers['authorization'].split(' ')[1]
    if (token) {
      res.locals.token = token
      return next()
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    res.status(401).send({ status: 'Error', msg: 'Strip Token Error' })
  }
}

exports.verifyToken = (req, res, next) => {
  const { token } = res.locals

  try {
    let payload = jwt.verify(token, APP_SECRET)
    if (payload) {
      res.locals.payload = payload
      return next()
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    res.status(401).send({ status: 'Error', msg: 'Verify Token Error!' })
  }
}

exports.CheckSession = async (req, res) => {
  const { payload } = res.locals
  res.status(200).send(payload)
}
