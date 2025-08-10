const router = require('express').Router()
const controller = require('../controllers/reviewController')
const middleWares = require('../middlewares')

router.get(
  '',
  middleWares.stripToken,
  middleWares.verifyToken,
  controller.getAllReviews
)
router.get(
  '/:id',
  middleWares.stripToken,
  middleWares.verifyToken,
  controller.getReview
)
router.put(
  '/:id',
  middleWares.stripToken,
  middleWares.verifyToken,
  controller.updateReview
)
router.post(
  '',
  middleWares.stripToken,
  middleWares.verifyToken,
  controller.postReview
)
router.delete(
  '/:id',
  middleWares.stripToken,
  middleWares.verifyToken,
  controller.deleteReview
)

module.exports = router
