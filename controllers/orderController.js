const Order = require('../models/Order')
const Food = require('../models/Food')

// tested w insomnia works ig
const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Order.find({
      customer_id: res.locals.payload.id
    }).populate('foodItems.foodId')
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
    const order = await Order.create({ ...req.body })
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
      const foodItem = await Food.findById(req.query.foodId)
      const currentCart = await Order.findById(req.params.id)
      const itemInCart = currentCart.foodItems.find(
        (item) => item.foodId.toString() === req.query.foodId
      )

      if (itemInCart) {
        if (itemInCart.quantity > 1) {
          itemInCart.quantity -= 1
        } else {
          let index = currentCart.foodItems.indexOf(itemInCart)
          currentCart.foodItems.splice(index, 1)
        }
        currentCart.total_price -= parseFloat(foodItem.price)
        const updated = await currentCart.save()

        res.send(updated)
      }
    }

    // append da order cart w new items
    if (req.query.action === 'add' && req.query.status === 'pending') {
      const foodItem = await Food.findById(req.query.foodId)
      const currentCart = await Order.findById(req.params.id).populate(
        'foodItems.foodId'
      )
      const itemInCart = currentCart.foodItems.find(
        (item) => item.foodId._id == req.query.foodId
      )

      let updatedOrder

      if (itemInCart) {
        itemInCart.quantity += 1
        currentCart.total_price += parseFloat(foodItem.price)
        updatedOrder = await currentCart.save()
      } else {
        currentCart.foodItems.push({
          foodId: req.query.foodId,
          quantity: 1
        })
        updatedOrder = await currentCart.save()
      }

      res.send(updatedOrder)
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = { getOrder, getOrdersByUserId, placeOrder, updateOrder }
