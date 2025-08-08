const Customer = require('../models/Customer')

// added for testing no auth yet
const createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create({ ...req.body })
    res.send(customer)
  } catch (error) {
    console.log(error)
  }
}

// added for testing no auth yet
const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({})
    res.send(customers)
  } catch (error) {
    console.log(error)
  }
}

module.exports = { createCustomer, getCustomers }
