const router = require('express').Router()
const controller = require('../controllers/orderController')

router.get('', controller.getOrdersByUserId)
router.get('/:id', controller.getOrder)
router.post('', controller.placeOrder)
router.put('/:id', controller.updateOrder)

module.exports = router