const router = require('express').Router()
const controller = require('../controllers/orderController')
const middleWares = require('../middlewares')

router.get(
  '',
  middleWares.stripToken,
  middleWares.verifyToken,
  controller.getOrdersByUserId
)
router.get(
  '/:id',
  middleWares.stripToken,
  middleWares.verifyToken,
  controller.getOrder
)
router.post(
  '',
  middleWares.stripToken,
  middleWares.verifyToken,
  controller.placeOrder
)
router.put(
  '/:id',
  middleWares.stripToken,
  middleWares.verifyToken,
  controller.updateOrder
)


module.exports = router


