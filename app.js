const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')

const menuRouter = require('./controllers/menu')
const sellerRouter = require('./controllers/seller')
const userRouter = require('./controllers/user')
const signupRouter = require('./controllers/signup')
const loginRouter = require('./controllers/login')
const paymentRouter = require('./controllers/payments')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI)
	.then(() => {
    	logger.info('Connected to MongoDB')
  	})
  	.catch((error) => {
    	logger.error('error connecting to MongoDB:', error.message)
  	})

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/menu', menuRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/user', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/signup', signupRouter)
app.use('/payments', paymentRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app