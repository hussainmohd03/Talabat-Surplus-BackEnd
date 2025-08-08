const Customer = require('../models/Customer')
const middleWares = require('../middlewares')

exports.Register = async (req, res) => {
  try {
    let userInDB = await Customer.findOne({ email })

    if (userInDB) {
      return res.send(400).send('user with this email already exists')
    }

    let passwordDigest = await middleWares.hashPassword(req.body.password)

    req.body.password = passwordDigest

    const newUser = await Customer.create(req.body)

    res.status(200).send(newUser)
  } catch (error) {
    throw error
  }
}

exports.Login = async (req, res) => {
  
}