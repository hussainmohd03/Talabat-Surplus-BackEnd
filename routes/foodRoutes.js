const foodCtrl = require('../controllers/foodController')
const router = require('express').Router()


//get all food items
router.post('/', foodCtrl.PostFoods)
router.get('/', foodCtrl.GetFoods)
router.get('/:id', foodCtrl.GetFoodsId)
router.put('/:id', foodCtrl.UpdateFood)
router.delete('/:id', foodCtrl.DeleteFood)

module.exports = router