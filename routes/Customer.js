const router = require('express').Router()
const CustomerCtrl = require('../controllers/Customer')
const middleWares = require('../middlewares')

router.post('/login', CustomerCtrl.Login)
router.post('/register', CustomerCtrl.Register)
router.put(
  '/update/:cust_id',
  middleWares.stripToken,
  middleWares.verifyToken,
  CustomerCtrl.UpdatePassword
)


module.exports = router
