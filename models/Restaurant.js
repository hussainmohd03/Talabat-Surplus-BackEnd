const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    rest_name: { type: String, required: true },
    rest_tel: {
      type: Number,
      required: true
    },
    rest_address: {
      type: String,
      required: true
    },
    bio: {
      type: String
    },
    avg_rating: {
      type: Number
    },
    logo_url: {
      type: String
    },
    email: {
      type: String,
      required: true
    },
    password_digest: {
      type: String,
      required: true
    },
    CR: {
      type: String
    }
  },

  {
    timestamps: true // createdAt & updatedAt
  }
)

module.exports = mongoose.model('Restaurant', restaurantSchema)
