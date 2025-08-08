const mongoose = require('mongoose')


const reviewsSchema = mongoose.Schema(
  {
    restaurant_comment: {
      type: String
    },
    rating: {
      type: Number
    },
    order_comment: {
      type: String
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    }
  },

  {
    timestamps: true // createdAt & updatedAt

  }
)

module.exports = mongoose.model('Review', reviewsSchema)
