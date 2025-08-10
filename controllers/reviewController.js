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
const getAllReviewsByRestaurant = async (req, res) => {
  try {
    const reviews = await Review.find({})
    res.send(reviews)
  } catch (error) {
    console.log('error in fetching all reviews', error)
  }
}

// post a review
// should work
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
    console.log('error in posting review', error)
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
    console.log('error in updating review', error)
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
    console.log('error in deleting review', error)
  }
}
module.exports = {
  getReview,
  getAllReviewsByRestaurant,
  postReview,
  updateReview,
  deleteReview
}
