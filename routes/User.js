const router = require('express').Router()
const UserCtrl = require('../controllers/User')
const middleWares = require('../middlewares')
const rateLimit = require('express-rate-limit')

// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 min
//   max: 5, // 5 attempts per IP
//   message: {
//     status: 'Error',
//     msg: 'Too many login attempts, try again in 10 minutes'
//   }
// })

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
  UserCtrl.updateProfile
)
router.get(
  '/profile/:id',
  middleWares.stripToken,
  middleWares.verifyToken,
  UserCtrl.getResById
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
