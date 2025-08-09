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

    const matched = await middleWares.comparePassword(
      req.body.password,
      userInDB.password_digest
    )

    if (matched) {
      let payload = { id: userInDB._id, email: userInDB.email, role }
      let token = middleWares.createToken(payload)
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

exports.UpdateAccount = async (req, res) => {
  try {
    const { role } = res.locals.payload
    const { id } = res.locals.payload
    const Model = getModel(role)

    const userInDB = await Model.findById(id)
    const matched = id === userInDB._id.toString()

    if (!userInDB) {
      return res.status(404).send({ status: 'Error', msg: 'User not found' })
    } else if (matched && role === 'customer') {
      let user = ''
      let payload = ''

      switch (req.query.action) {
        case 'avatar_url':
          user = await Model.findByIdAndUpdate(
            id,
            { avatar_url: req.body.avatar_url },
            {
              new: true
            }
          )
          payload = { id: user._id, email: user.email, role }
          return res.status(200).send({
            status: `${req.query.action} updated successfully`,
            user: payload
          })

        case 'first_name':
          user = await Model.findByIdAndUpdate(
            id,
            { first_name: req.body.first_name },
            {
              new: true
            }
          )
          payload = { id: user._id, email: user.email, role }
          return res.status(200).send({
            status: `${req.query.action} updated successfully`,
            user: payload
          })

        case 'last_name':
          user = await Model.findByIdAndUpdate(
            id,
            { last_name: req.body.last_name },
            {
              new: true
            }
          )
          payload = { id: user._id, email: user.email, role }
          return res.status(200).send({
            status: `${req.query.action} updated successfully`,
            user: payload
          })

        case 'phone_number':
          user = await Model.findByIdAndUpdate(
            id,
            { phone_number: req.body.phone_number },
            {
              new: true
            }
          )
          payload = { id: user._id, email: user.email, role }
          return res.status(200).send({
            status: `${req.query.action} updated successfully`,
            user: payload
          })

        case 'address':
          user = await Model.findByIdAndUpdate(
            id,
            { address: req.body.address },
            {
              new: true
            }
          )
          payload = {
            id: user._id,
            email: user.email,
            role
          }
          return res.status(200).send({
            status: `${req.query.action} updated successfully`,
            user: payload
          })
      }
    } else if (matched && role === 'restaurant') {
      let user = ''
      let payload = ''

      switch (req.query.action) {
        case 'rest_name':
          user = await Model.findByIdAndUpdate(
            id,
            { rest_name: req.body.rest_name },
            {
              new: true
            }
          )
          payload = { id: user._id, email: user.email, role }
          return res.status(200).send({
            status: `${req.query.action} updated successfully`,
            user: payload
          })

        case 'rest_address':
          user = await Model.findByIdAndUpdate(
            id,
            { rest_address: req.body.rest_address },
            {
              new: true
            }
          )
          payload = { id: user._id, email: user.email, role }
          return res.status(200).send({
            status: `${req.query.action} updated successfully`,
            user: payload
          })

        case 'bio':
          user = await Model.findByIdAndUpdate(
            id,
            { bio: req.body.bio },
            {
              new: true
            }
          )
          payload = { id: user._id, email: user.email, role }
          return res.status(200).send({
            status: `${req.query.action} updated successfully`,
            user: payload
          })

        case 'logo_url':
          user = await Model.findByIdAndUpdate(
            id,
            { logo_url: req.body.logo_url },
            {
              new: true
            }
          )
          payload = { id: user._id, email: user.email, role }
          return res.status(200).send({
            status: `${req.query.action} updated successfully`,
            user: payload
          })

        case 'email':
          user = await Model.findByIdAndUpdate(
            id,
            { email: req.body.email },
            {
              new: true
            }
          )
          payload = { id: user._id, email: user.email, role }
          return res.status(200).send({
            status: `${req.query.action} updated successfully`,
            user: payload
          })
      }
    }
  } catch (error) {}
}
