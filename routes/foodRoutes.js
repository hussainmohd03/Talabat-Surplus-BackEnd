const controller = require('../controllers/foodController')
const router = require('express').Router()
const middleWares = require('../middlewares')

//get all food items
router.post(
  '/',
  middleWares.stripToken,
  middleWares.verifyToken,
  controller.postFood
)
router.get('/', controller.getAllFood)
router.get('/:id', controller.getFood)
router.put(
  '/:id',
  middleWares.stripToken,
  middleWares.verifyToken,
  controller.updateFood
)
router.delete(
  '/:id',
  middleWares.stripToken,
  middleWares.verifyToken,
  controller.deleteFood
)


module.exports = router
