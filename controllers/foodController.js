const Food = require('../models/Food')

// post food item
const postFood = async (req, res) => {
  try {
    req.body.restaurant_id = res.locals.payload.id
    const food = await Food.create({ ...req.body })
    res.status(200).send(food)
  } catch (error) {
    throw error
  }
}

// getting all food depending if query param exists
const getAllFood = async (req, res) => {
  try {
    if (req.query.cuisine) {
      const foodList = await Food.find({ cuisine: req.query.cuisine })
      res.send(foodList)
    } else {
      const foods = await Food.find({})
      res.status(200).send(foods)
    }
  } catch (error) {
    throw error
  }
}

// get food  item
const getFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
    res.send(food)
  } catch (error) {
    console.log(error)
  }
}

// updating
const updateFood = async (req, res) => {
  try {
    // make sure only the user who own this is the only one allowed to update it
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })
    res.status(200).send(food)
  } catch (error) {
    throw error
  }
}

// delete
const deleteFood = async (req, res) => {
  try {
    // make sure only the user who own this is the only one allowed to delete it

    await Food.deleteOne({
      _id: req.params.id
    })
    res.status(200).send({
      msg: 'food item deleted',
      payload: req.params.id,
      status: 'Ok'
    })
  } catch (error) {
    throw error
  }
}

module.exports = {
  postFood,
  getAllFood,
  getFood,
  updateFood,
  deleteFood
}
