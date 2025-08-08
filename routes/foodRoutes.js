
const controller = require('../controllers/foodController')
const router = require('express').Router()

//get all food items
router.post('/', controller.postFood)
router.get('/', controller.getAllFood)
router.get('/:id', controller.getFood)
router.put('/:id', controller.updateFood)
router.delete('/:id', controller.deleteFood)


module.exports = router
