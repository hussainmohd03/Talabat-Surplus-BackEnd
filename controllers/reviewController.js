const Review = require('../models/Review')
const Order = require('../models/Order')
// get a review
const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
    res.send(review)
  } catch (error) {}
}

// get all reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
    res.send(reviews)
  } catch (error) {
    throw error
  }
}

// post a review
const postReview = async (req, res) => {
  try {
    const { id } = res.locals.payload
    const orders = await Order.find({ customer_id: id })

    orders.forEach(async (order) => {
      if (order.order_status === 'approved') {
        const review = await Review.create({ ...req.body })
        return res.send(review)
      } else {
        res.send('you havent placed an order yet')
      }
    })
  } catch (error) {
    throw error
  }
}

// update review
// only mutable by whoever made the review
const updateReview = async (req, res) => {
  try {
    const { id } = res.locals.payload
    const review = await Review.findById(req.params.id)
    const order = await Order.findById(review.order_id)
    if (order.customer_id.toString() === id) {
      const updatedReview = await Review.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      )
      res.send(updatedReview)
    }
  } catch (error) {
    throw error
  }
}

// delete review
// can only delete my reveiw

const deleteReview = async (req, res) => {
  try {
    const { id } = res.locals.payload
    const review = await Review.findById(req.params.id)
    const order = await Order.findById(review.order_id)
    if (order.customer_id.toString() === id) {
      await Review.deleteOne({ _id: req.params.id })
      res.status(200).send({ msg: 'review deleted' })
    }
  } catch (error) {
    throw error
  }
}
module.exports = {
  getReview,
  getAllReviews,
  postReview,
  updateReview,
  deleteReview
}
