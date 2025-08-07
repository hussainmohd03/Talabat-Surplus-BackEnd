const mongoose = require('mongoose')

const customerSchema = {
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password_digest: {
    type: String,
    required: true
  },
  phone_number: {
    type: Number
  },
  address: {
    type: String,
    required: true
  },
  avatar_url: {
    type: String
  }
}

module.exports = mongoose.model('Customer', customerSchema)
