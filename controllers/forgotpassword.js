const forgotRouter = require('express').Router()
const User = require('../models/user')

forgotRouter.post('/', async (request, response, next) => {
	const body = request.body
	const user = User.findOne({ email: body.email })

	if(!user){
		return response.json({message: 'Email not Found'})
	}

	

})

module.exports = forgotRouter