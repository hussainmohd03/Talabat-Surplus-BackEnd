const Restaurant  = require('../models/Restaurant')

//get the restaurant profile

const GetRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    res.send(restaurant)
  } catch(error){
  throw error
}
}

//update the restaurant profile

const UpdateResProfile = async (req, res) => {
try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    res.status(200).send(restaurant)
  } catch (error) {
    throw error
  }
} 

//delete the restaurant profile

const DeleteResProfile = async (req, res) => {
  try{
    await Restaurant.deleteOne({
      _id: req.params.id})
      res.status(200).send({
        msg: 'Restaurant Profile Deleted',
        payload: req.params.id, 
        status: 'Ok' })
  } catch (error) {
    throw error
  }
}


module.exports = {
  GetRestaurantById,
  UpdateResProfile,
  DeleteResProfile
}
