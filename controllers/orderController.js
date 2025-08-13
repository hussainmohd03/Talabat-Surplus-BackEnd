const Order = require('../models/Order')
const Food = require('../models/Food')
const User = require('../models/Customer')
// tested w insomnia works ig
const getOrderByUserId = async (req, res) => {
  try {
    const order = await Order.findOne({
      customer_id: res.locals.payload.id,
      order_status: 'pending',
      payment_status: 'pending'
    }).populate('food_id')
    res.send(order)
    console.log(order)
  } catch (error) {
    console.log('error in getting orders by user id', error)
  }
}

const getApprovedOrders = async (req, res) => {
  try {
    console.log('id', res.locals.payload.id)
    if (res.locals.payload.role === 'customer') {
      const user = await User.findById(req.params.id)
      const orders = await Order.find({
        customer_id: res.locals.payload.id,
        order_status: 'pending',
        payment_status: 'approved'
      }).populate('food_id')
      res.send(orders)
    }
    if (res.locals.payload.role === 'restaurant') {
      const foods = await Food.find({
        restaurant_id: res.locals.payload.id
      })
      console.log('foods', foods)
      const foodsId = foods.map((food) => food._id)
      console.log(foodsId)
      const orders = await Order.find({
        payment_status: 'approved',
        food_id: { $in: foodsId }
      })
      res.send(orders)
    }
  } catch (error) {
    console.log('error in getting orders by user id', error)
  }
}

// tested w insomnia works ig
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    res.send(order)
  } catch (error) {
    console.log('error in getting order', error)
  }
}

// should also work
const placeOrder = async (req, res) => {
  try {
    req.body.customer_id = res.locals.payload.id
    const order = await Order.create({ ...req.body })

    // console.log(await order.populate('food_id'))
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
          { order_status: 'approved' },
          {
            new: true
          }
        )
        res.send(approvedOrder)
      }
      // nothing to delete here since cancelled means nothing to the backend, just clears cart in the front end
    } if (req.query.status === 'cancelled') {
      const cancelledOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { order_status: 'cancelled' },
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
              currentCart.total_price - parseFloat(itemId.price)
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
            total_price: currentCart.total_price + parseFloat(itemId.price)
          }
        },
        {
          new: true
        }
      )
      res.send(updatedOrder)
    }
    // } else {
    //   const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    //     new: true
    //   }).populate('food_id')
    //   console.log(order)
    //   // res.send(order)
    // }
  } catch (error) {
    console.log(error)
  }
}

// const resApprovedOrders = async (req, res) => {
//   try {
//     if (req.query.action === 'approve' && req.query.status === 'pending') {
//       const order = await Order.findByIdAndUpdate(
//         req.params.id,
//         { order_status: 'approved' },
//         { new: true }
//       ).populate('food_id')
//       res.send(order)
//     }
//   } catch (error) {}
// }

module.exports = {
  getOrder,
  getOrderByUserId,
  placeOrder,
  updateOrder,
  getApprovedOrders
}
