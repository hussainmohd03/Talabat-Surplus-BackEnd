const mongoose = require('mongoose')

const orderSchema = {
  payment_status: {
    type: String,
    enum: ['pending', 'approved']
  },
  order_status: {
    type: String,
    enum: ['pending', 'approved']
  },
  food_details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food'
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
}

module.exports = mongoose.model('Order', orderSchema)
