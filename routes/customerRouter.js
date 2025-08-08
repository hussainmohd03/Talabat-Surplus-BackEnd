const router = require('express').Router()
const controller = require('../controllers/customerController')

// added for testing no auth yet
router.post('', controller.createCustomer)
router.get('', controller.getCustomers)

module.exports = router


