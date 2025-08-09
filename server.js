// imports
const express = require('express')
require('dotenv').config()
const cors = require('cors')
const path = require('path')

// initialize app
const app = express()

// database configuration
const mongoose = require('./config/db')

// set port configuration
const port = process.env.PORT ? process.env.PORT : 3000

// require middlwares
const morgan = require('morgan')

// use middlewares
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.json())

// root route
app.get('/', (req, res) => {
  res.send('Your app is connected . . . ')
})

// require routers
const orderRouter = require('./routes/orderRouter')
const foodRouter = require('./routes/foodRoutes')
const reviewRouter = require('./routes/reviewRouter')
const UserRt = require('./routes/User')

// use routers
app.use('/orders', orderRouter)
app.use('/foods', foodRouter)
app.use('/reviews', reviewRouter)
app.use('/auth', UserRt)

// listener
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
