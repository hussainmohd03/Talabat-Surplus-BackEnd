const Order = require('../models/Order')
const Food = require('../models/Food')

// tested w insomnia works ig
const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({ customer_id: res.locals.payload.id })
    res.send(orders)
  } catch (error) {
    console.log('error in getting orders by user id', error)
  }
}

// tested w insomnia works ig
const getOrder = async (req, res) => {
  try {
    const orders = await Order.findById(req.params.id)
    res.send(orders)
  } catch (error) {
    console.log('error in getting order', error)
  }
}

// should also work
const placeOrder = async (req, res) => {
  try {
    req.body.customer_id = res.locals.payload.id
    const order =  await Order.create({ ...req.body })
    res.send(order)
  } catch (error) {
    console.log('error in placing order', error)
  }
}

// hmmm
const updateOrder = async (req, res) => {
  try {
    if (req.query.action === 'status') {
      if (req.query.status === 'approved') {
        const approvedOrder = await Order.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true
          }
        )
        res.send(approvedOrder)
      }
      // nothing to delete here since cancelled means nothing to the backend, just clears cart in the front end
    } else if (req.query.status === 'cancelled') {
      const cancelledOrder = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      )
      res.send(cancelledOrder)
    }

    // clearing cart of all order items
    // should only execute if action is clear and status whether that's payment or the order itself is still pending
    if (req.query.action === 'clear' && req.query.status === 'pending') {
      const clearedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          total_price: 0,
          food_id: []
          // restaurant_id: []
        },
        {
          new: true
        }
      )
      res.send(clearedOrder)
    }

    // remove a singular food item from the array of food_id where it matches with the query param foodId (only if status is pending)
    // update price, food details, and restaurant details accordingly

    if (req.query.action === 'remove' && req.query.status === 'pending') {
      const itemId = await Food.findById(req.query.foodId)
      console.log(itemId)
      const currentCart = await Order.findById(req.params.id)
      console.log(currentCart)
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $pull: {
            food_id: req.query.foodId
            // restaurant_id: currentCart.restaurant_id
          },
          // looked $set up
          // will continue to do this even if it goes to negatives
          $set: {
            total_price: Math.max(
              0,
              currentCart.total_price - parseInt(itemId.price)
            )
          }
        },
        {
          new: true
        }
      )
      console.log(updatedOrder)
      res.send(updatedOrder)
    }

    // append da order cart w new items
    if (req.query.action === 'add' && req.query.status === 'pending') {
      const itemId = await Food.findById(req.query.foodId)
      const currentCart = await Order.findById(req.params.id)
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            food_id: req.query.foodId
            // restaurant_id: currentCart.restaurant_id
          },
          // looked $set up
          $set: {
            total_price: currentCart.total_price + parseInt(itemId.price)
          }
        },
        {
          new: true
        }
      )
      res.send(updatedOrder)
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getOrder, getOrdersByUserId, placeOrder, updateOrder }
