const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  payment_status: {
    type: String,
    enum: ['pending', 'approved', 'cancelled']
  },
  order_status: {
    type: String,
    enum: ['pending', 'approved', 'cancelled']
  },
  food_details: [{
    type: String
  }],
  total_price: {
    type: Number,
    required: true
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  restaurant_id: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  food_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food'
    }
  ]
})

module.exports = mongoose.model('Order', orderSchema)
