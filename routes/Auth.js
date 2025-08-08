const router = require('express').Router()
const AuthCtrl = require('../controllers/Auth')
const middleWares = require('../middlewares')

router.post('/login', AuthCtrl.Login)
router.post('/register', AuthCtrl.Register)
router.put(
  '/update/:id',
  middleWares.stripToken,
  middleWares.verifyToken,
  AuthCtrl.UpdatePassword
)

router.get(
  '/session',
  middleWares.stripToken,
  middleWares.verifyToken,
  middleWares.CheckSession
)

module.exports = router
