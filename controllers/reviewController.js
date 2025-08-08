const Review = require('../models/Review')

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
    console.log('error in fetching all reviews', error)
  }
}

// post a review
const postReview = async (req, res) => {
  try {
    const review = await Review.create({ ...req.body })
    res.send(review)
  } catch (error) {
    console.log('error in posting review', error)
  }
}

// update review
const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    )
    res.send(updatedReview)
  } catch (error) {
    console.log('error in updating review', error)
  }
}

// delete review
const deleteReview = async (req, res) => {
  try {
    await Review.deleteOne({ _id: req.params.id })
    res.status(200).send({ msg: 'review deleted' })
  } catch (error) {
    console.log('error in deleting review', error)
  }
}
module.exports = {
  getReview,
  getAllReviews,
  postReview,
  updateReview,
  deleteReview
}
