const Order = require('../models/Order')
const Food = require('../models/Food')
const User = require('../models/Customer')

const getOrderByUserId = async (req, res) => {
  try {
    const order = await Order.findOne({
      customer_id: res.locals.payload.id,
      order_status: 'pending',
      payment_status: 'pending'
    }).populate('foodItems.foodId')
    res.send(order)
  } catch (error) {
    throw error
  }
}

const getApprovedOrders = async (req, res) => {
  try {
    if (res.locals.payload.role === 'customer') {
      const user = await User.findById(req.params.id)
      const orders = await Order.find({
        customer_id: res.locals.payload.id,
        order_status: 'pending',
        payment_status: 'approved'
      }).populate('foodItems.foodId')
      res.send(orders)
    }
    if (res.locals.payload.role === 'restaurant') {
      const foods = await Food.find({
        restaurant_id: res.locals.payload.id
      })
      const foodsId = foods.map((food) => food._id)
      const chosenFood = foodsId.toString()
      const orders = await Order.find({
        payment_status: 'approved'
      }).populate('foodItems.foodId')

      res.send(orders)
    }
  } catch (error) {
    throw error
  }
}

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    res.send(order)
  } catch (error) {
    throw error
  }
}

const placeOrder = async (req, res) => {
  try {
    req.body.customer_id = res.locals.payload.id
    const order = await Order.create({ ...req.body })
    res.send(order)
  } catch (error) {
    throw error
  }
}

const changeStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })
  res.status(200).send(order)
}

const updateOrder = async (req, res) => {
  try {
    if (req.query.action === 'status') {
      if (req.query.status === 'approved') {
        const approvedOrder = await Order.findByIdAndUpdate(
          req.params.id,
          { order_status: 'approved' },
          {
            new: true
          }
        )
        res.send(approvedOrder)
      }
    }
    if (req.query.status === 'cancelled') {
      const cancelledOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { order_status: 'cancelled' },
        {
          new: true
        }
      )
      res.send(cancelledOrder)
    }
    if (req.query.action === 'clear' && req.query.status === 'pending') {
      const clearedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          total_price: 0,
          food_id: []
        },
        {
          new: true
        }
      )
      res.send(clearedOrder)
    }
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
    throw error
  }
}

module.exports = {
  getOrder,
  getOrderByUserId,
  placeOrder,
  updateOrder,
  changeStatus,
  getApprovedOrders
}
