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
      data.avatar_url = req.body.avatar_url
    } else if (role === 'restaurant') {
      data.rest_name = req.body.rest_name
      data.rest_tel = req.body.rest_tel
      data.rest_address = req.body.rest_address
      data.email = req.body.email
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

    // Check if account is locked
    if (userInDB.lockUntil && userInDB.lockUntil > Date.now()) {
      return res.status(423).send({
        status: 'Error',
        msg: 'Account temporarily locked due to too many failed attempts. Try again later.'
      })
    }

    const matched = await middleWares.comparePassword(
      req.body.password,
      userInDB.password_digest
    )

    if (matched) {
      // Reset failed login attempts on success
      userInDB.failedLoginAttempts = 0
      userInDB.lockUntil = undefined
      await userInDB.save()

      let payload = {
        id: userInDB._id,
        email: userInDB.email,
        role,
        name: userInDB.first_name
      }
      let token = middleWares.createToken(payload)
      return res.status(200).send({ user: payload, token })
    }

    userInDB.failedLoginAttempts += 1

    if (userInDB.failedLoginAttempts >= 5)
      // lock account for 10 minutes
      userInDB.lockUntil = Date.now() + 10 * 60 * 1000
    await userInDB.save()

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
      return res.status(404).send({ status: 'error', msg: 'user not found' })
    }

    if (!req.body.old_password || !req.body.new_password) {
      return res
        .status(400)
        .send({ status: 'error', msg: 'old and new passwords are required' })
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

      const payload = {
        id: userInDB._id,
        email: userInDB.email,
        role,
        name: userInDB.first_name
      }
      return res
        .status(200)
        .send({ status: 'password updated successfully', user: payload })
    }

    res.status(401).send({ status: 'error', msg: 'update password failed' })
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

exports.getResById = async (req, res) => {
  try {
    // const { id } = req.params.id
    const Model = getModel('restaurant')
    const profile = await Model.findById(req.params.id)
    // console.log('id', id)
    console.log('profile', profile)
    res.send(profile)
  } catch (error) {}
}

exports.deleteProfile = async (req, res) => {
  try {
    const { role, id } = res.locals.payload
    const Model = getModel(role)

    const deleted = await Model.findByIdAndDelete(id)
    if (deleted)
      return res.status(200).send({ msg: `${role} profile deleted`, deleted })

    return res.status(404).send({ msg: `${role} not found` })
  } catch (error) {
    throw error
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const { role, id } = res.locals.payload
    const Model = getModel(role)

    const updatedProfile = await Model.findByIdAndUpdate(id, req.body, {
      new: true
    })

    if (!updatedProfile)
      return res.status(404).send({ msg: `${role} not found` })

    res.status(200).send({ msg: `${role} profile updated` })
  } catch (error) {
    throw error
  }
}
