const customerCtrl = require('../controllers/customerController')
const router = require('express').Router()

router.get('/customers/:id', customerCtrl.GetCustomerById)
router.put('/customers/:id', customerCtrl.UpdateProfile)
router.delete('/customers/:id', customerCtrl.DeleteProfile)

module.exports = router
