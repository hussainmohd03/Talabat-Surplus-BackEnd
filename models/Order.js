const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    payment_status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled']
    },
    order_status: {
      type: String,
      enum: ['pending', 'approved', 'cancelled']
    },
    foodItems: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Food'
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1
        }
      }
    ],
    total_price: {
      type: Number,
      required: true,
      min: 0
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    }
  },
  {
    timestamps: true // createdAt & updatedAt
  }
)

module.exports = mongoose.model('Order', orderSchema)
