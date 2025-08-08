const router = require('express').Router()
const CustomerCtrl = require('../controllers/Customer')

router.post('/login', CustomerCtrl.Login)
router.post('/register', CustomerCtrl.Register)

module.exports = router