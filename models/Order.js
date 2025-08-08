const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  payment_status: {
    type: String,
    enum: ['pending', 'approved']
  },
  order_status: {
    type: String,
    enum: ['pending', 'approved']
  },
  food_details: {
    type: Array
  },
  total_price: {
    type: Number,
    required: true
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  restaurant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }
})

module.exports = mongoose.model('Order', orderSchema)
