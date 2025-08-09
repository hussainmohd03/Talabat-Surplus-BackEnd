const Customer = require('../models/Customer')

//get customer profile
const GetCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
    res.send(customer)
  } catch (error) {
    throw error
  }
}

//update customer profile
const UpdateProfile = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    res.status(200).send(customer)
  } catch (error) {
    throw error
  }
}

//delete customer profile
const DeleteProfile = async (req, res) => {
  try {
    await Customer.deleteOne({
      _id: req.params.id
    })
    res.status(200).send({
      msg: 'Profile Deleted',
      payload: req.params.id,
      status: 'Ok'
    })
  } catch (error) {
    throw error
  }
}

module.exports = {
  GetCustomerById,
  UpdateProfile,
  DeleteProfile
}
