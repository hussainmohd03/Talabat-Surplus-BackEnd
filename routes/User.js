const router = require('express').Router()
const UserCtrl = require('../controllers/User')
const middleWares = require('../middlewares')

router.post('/login', UserCtrl.Login)
router.post('/register', UserCtrl.Register)
router.put(
  '/update/:id',
  middleWares.stripToken,
  middleWares.verifyToken,
  UserCtrl.UpdatePassword
)
router.get(
  '/session',
  middleWares.stripToken,
  middleWares.verifyToken,
  middleWares.CheckSession
)

module.exports = router
