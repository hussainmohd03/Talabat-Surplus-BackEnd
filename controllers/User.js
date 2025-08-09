const Customer = require('../models/Customer')
const Restaurant = require('../models/Restaurant')
const middleWares = require('../middlewares')

const getModel = (role) => {
  if (role === 'customer') return Customer
  if (role === 'restaurant') return Restaurant
}

exports.Register = async (req, res) => {
  try {
    const { role } = req.query
    const Model = getModel(role)

    let userInDB = await Model.findOne({ email: req.body.email })
    if (userInDB) {
      return res.status(400).send('User with this email already exists')
    }

    const passwordDigest = await middleWares.hashPassword(req.body.password)

    let data = { email: req.body.email, password_digest: passwordDigest }

    if (role === 'customer') {
      data.first_name = req.body.first_name
      data.last_name = req.body.last_name
      data.address = req.body.address
    } else if (role === 'restaurant') {
      data.rest_name = req.body.name
      data.rest_tel = req.body.rest_tel
      data.rest_address = req.body.address
      data.CR = req.body.CR
    }

    const newUser = await Model.create(data)
    res.status(200).send(newUser)
  } catch (error) {
    throw error
  }
}

exports.Login = async (req, res) => {
  try {
    const { role } = req.query
    const Model = getModel(role)

    const userInDB = await Model.findOne({ email: req.body.email })
    if (!userInDB) {
      return res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
    }

    const matched = await middleWares.comparePassword(
      req.body.password,
      userInDB.password_digest
    )

    if (matched) {
      const payload = { id: userInDB._id, email: userInDB.email, role }
      const token = middleWares.createToken(payload)
      return res.status(200).send({ user: payload, token })
    }

    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    throw error
  }
}

exports.UpdatePassword = async (req, res) => {
  try {
    const { role } = res.locals.payload
    const { id } = res.locals.payload
    const Model = getModel(role)

    let userInDB = await Model.findById(id)
    if (!userInDB) {
      return res.status(404).send({ status: 'Error', msg: 'User not found' })
    }

    if (!req.body.old_password || !req.body.new_password) {
      return res
        .status(400)
        .send({ status: 'Error', msg: 'Old and new passwords are required' })
    }

    const matched = await middleWares.comparePassword(
      req.body.old_password,
      userInDB.password_digest
    )

    if (matched) {
      const passwordDigest = await middleWares.hashPassword(
        req.body.new_password
      )
      userInDB = await Model.findByIdAndUpdate(
        id,
        { password_digest: passwordDigest },
        { new: true }
      )

      const payload = { id: userInDB._id, email: userInDB.email, role }
      return res
        .status(200)
        .send({ status: 'Password updated successfully', user: payload })
    }

    res.status(401).send({ status: 'Error', msg: 'Update password failed' })
  } catch (error) {
    throw error
  }
}

exports.getProfileById = async (req, res) => {
  try {
    const { role, id } = res.locals.payload
    const Model = getModel(role)

    const profile = await Model.findById(id)
    if (!profile) return res.status(404).send({ msg: `${role} not found` })

    res.status(200).send(profile)
  } catch (error) {
    throw error
  }
}
