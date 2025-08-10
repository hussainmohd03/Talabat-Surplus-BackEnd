const router = require('express').Router()
const controller = require('../controllers/reviewController')
const middleWares = require('../middlewares')

router.get('', controller.getAllReviews)
router.get('/:id', controller.getReview)
router.put('/:id', controller.updateReview)
router.post('',   middleWares.stripToken,
  middleWares.verifyToken, controller.postReview)
router.delete('/:id', controller.deleteReview)

module.exports = router
