const { Food } = require('../models/Food')


//getting all food
const GetFoods = async (req, res) => {
try {
  const foods = await Food.find({})
  res.status(200).send(foods)
} catch (error) {
  throw error
}
}


// get by Id
const GetFoodsId = async (req, res) => {
  try {
    const foodId = await Food.findById(req.params.food_id)
  } catch(error){
  throw error
}
}



// updating
const UpdateFood = async (req, res) => {
try {
    const food = await Food.findByIdAndUpdate(req.params.food_id, req.body, {
      new: true
    })
    res.status(200).send(food)
  } catch (error) {
    throw error
  }
} 

//Delete

const DeleteFood = async (req, res) => {
  try{
    await Food.deleteOne({
      _id: req.params.food_id})
      res.status(200).send({
        msg: 'Food Item Deleted',
        payload: req.params.food_id, 
        status: 'Ok' })
  } catch (error) {
    throw error
  }
}

