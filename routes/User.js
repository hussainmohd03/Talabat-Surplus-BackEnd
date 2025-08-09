const router = require('express').Router()
const UserCtrl = require('../controllers/User')
const middleWares = require('../middlewares')

router.post('/login', UserCtrl.Login)
router.post('/register', UserCtrl.Register)
router.put(
  '/update',
  middleWares.stripToken,
  middleWares.verifyToken,
  UserCtrl.UpdatePassword
)

router.put(
  '/:id',
  middleWares.stripToken,
  middleWares.verifyToken,
  AuthCtrl.UpdateAccount
)

router.get(
  '/session',
  middleWares.stripToken,
  middleWares.verifyToken,
  middleWares.CheckSession
)

module.exports = router
