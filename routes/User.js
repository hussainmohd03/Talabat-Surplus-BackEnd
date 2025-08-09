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
  '/profile',
  middleWares.stripToken,
  middleWares.verifyToken,
  UserCtrl.UpdateAccount
)

router.get(
  '/profile',
  middleWares.stripToken,
  middleWares.verifyToken,
  UserCtrl.getProfileById
)
router.put(
  '/profile',
  middleWares.stripToken,
  middleWares.verifyToken,
  UserCtrl.updateProfile
)
router.delete(
  '',
  middleWares.stripToken,
  middleWares.verifyToken,
  UserCtrl.deleteProfile
)
router.get(
  '/session',
  middleWares.stripToken,
  middleWares.verifyToken,
  middleWares.CheckSession
)

module.exports = router
