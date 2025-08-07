const foodCtrl = require('../controllers/foodController')


//get all food items
router.get('/foods', foodCtrl)

//get all food in a specific cuisine
router.get('/foods?cuisine')





router.post('/foods', foodCtrl)