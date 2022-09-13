const config = require('../utils/config')
const loginRouter = require('express').Router()
const User = require('../models/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({ username: body.username }).populate({
      path: 'cart',
      populate: {
          path: 'item',
          model: 'Menu'
      } 
  })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    name: user.name,
    email: user.email,
    phone: user.phone,
    id: user._id
  }

  const token = jwt.sign(userForToken, config.SECRET)

  response
    .status(200)
    .json({ token, username: user.username, name: user.name, email: user.email, phone: user.phone, cart: user.cart})
})



module.exports = loginRouter