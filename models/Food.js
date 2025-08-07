const mongoose = require('mongoose')

const foodSchema = new Schema({
  name: { type: String, required: true },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  image_url: {
    type: String
  },
  original_price: {
    type: Number
  }, 
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'
  }
})

module.exports = mongoose.model('Food', foodSchema)
