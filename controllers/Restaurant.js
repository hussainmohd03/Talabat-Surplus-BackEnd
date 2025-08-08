const Restaurant = require('../models/Restaurant')
const middleWares = require('../middlewares')

exports.Register = async (req, res) => {
  try {
    const { email, password, name, rest_tel, address, CR } = req.body
    let userInDB = await Restaurant.findOne({ email })

    if (userInDB) {
      return res.send(400).send('user with this email already exists')
    }

    let passwordDigest = await middleWares.hashPassword(password)

    const data = {
      rest_name: name,
      rest_tel: rest_tel,
      email: email,
      password_digest: passwordDigest,
      rest_address: address,
      CR: CR
    }

    const newUser = await Restaurant.create(data)

    res.status(200).send(newUser)
  } catch (error) {
    throw error
  }
}

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body

    const userInDB = await Restaurant.findOne({ email })

    let matched = await middleWares.comparePassword(
      password,
      userInDB.password_digest
    )
    if (matched) {
      const payload = {
        id: userInDB._id,
        email: userInDB.email,
        role: 'restaurant'
      }
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
    const { old_password, new_password } = req.body

    let userInDB = await Restaurant.findById(req.params.rest_id)

    let matched = await middleWares.comparePassword(
      old_password,
      userInDB.password_digest
    )

    if (matched) {
      let passwordDigest = await middleWares.hashPassword(new_password)

      userInDB = await Restaurant.findByIdAndUpdate(req.params.rest_id, {
        password_digest: passwordDigest
      })
      let payload = {
        id: userInDB._id,
        email: userInDB.email,
        role: 'restaurant'
      }
      return res
        .status(200)
        .send({ status: 'password Updated successfully', user: payload })
    }
    res.status(401).send({ status: 'Error', msg: 'updated Password failed' })
  } catch (error) {
    throw error
  }
}
