const resCtrl = require('../controllers/resController')
const router = require('express').Router()


router.get('/restaurants/:id', resCtrl.GetRestaurantById)
router.put('/restaurants/:id', resCtrl.UpdateResProfile)
router.delete('/restaurants/:id', resCtrl.DeleteResProfile)

module.exports = router