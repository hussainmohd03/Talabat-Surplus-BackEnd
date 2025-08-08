const router = require('express').Router()
const middleWares = require('../middlewares')

router.get(
  '/',
  middleWares.stripToken,
  middleWares.verifyToken,
  middleWares.CheckSession
)

module.exports = router
