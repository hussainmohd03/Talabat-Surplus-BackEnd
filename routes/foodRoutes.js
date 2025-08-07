const foodCtrl = require('../controllers/foodController')


//get all food items
router.post('/foods', foodCtrl.PostFoods)
router.get('/foods', foodCtrl.GetFoods)
router.get('/:id/foods', foodCtrl.GetFoodsId)
router.put('/:id/foods', foodCtrl.UpdateFood)
router.delete('/:id/foods', foodCtrl.DeleteFood)

module.exports = router