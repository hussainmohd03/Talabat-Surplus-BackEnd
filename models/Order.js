const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    payment_status: {
      type: String,
      enum: ['pending', 'approved']
    },
    order_status: {
      type: String,
      enum: ['pending', 'approved']
    },
    food_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
      }
    ],
    total_price: {
      type: Number,
      required: true
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    }
    // restaurant_id: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Restaurant',
    //   required: true
    // }]
  },
  {
    timestamps: true // createdAt & updatedAt
  }
)

module.exports = mongoose.model('Order', orderSchema)
