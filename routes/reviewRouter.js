const router = require('express').Router()
const controller = require('../controllers/reviewController')

router.get('', controller.getAllReviews)
router.get('/:id', controller.getReview)
router.put('/:id', controller.updateReview)
router.post('', controller.postReview)
router.delete('/:id', controller.deleteReview)

module.exports = router
