const router = require('express').Router()
const RestaurantCtrl = require('../controllers/Restaurant')
const middleWares = require('../middlewares')

router.post('/login', RestaurantCtrl.Login)
router.post('/register', RestaurantCtrl.Register)
// router.put(
//   '/update/:cust_id',
//   middleWares.stripToken,
//   middleWares.verifyToken,
//   RestaurantCtrl.UpdatePassword
// )

module.exports = router
