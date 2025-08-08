const Customer = require('../models/Customer')
const middleWares = require('../middlewares')

exports.Register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, address } = req.body
    let userInDB = await Customer.findOne({ email })

    if (userInDB) {
      return res.send(400).send('user with this email already exists')
    }

    let passwordDigest = await middleWares.hashPassword(password)

    const data = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password_digest: passwordDigest,
      address: address
    }

    const newUser = await Customer.create(data)

    res.status(200).send(newUser)
  } catch (error) {
    throw error
  }
}

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body

    const userInDB = await Customer.findOne({ email })

    let matched = await middleWares.comparePassword(
      password,
      userInDB.password_digest
    )
    if (matched) {
      const payload = {
        id: userInDB._id,
        email: userInDB.email,
        role: 'customer'
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

    let userInDB = await Customer.findById(req.params.cust_id)

    let matched = await middleWares.comparePassword(
      old_password,
      userInDB.password_digest
    )

    if (matched) {
      let passwordDigest = await middleWares.hashPassword(new_password)

      userInDB = await Customer.findByIdAndUpdate(req.params.cust_id, {
        password_digest: passwordDigest
      })
      let payload = {
        id: userInDB._id,
        email: userInDB.email,
        role: 'customer'
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
