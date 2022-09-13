const signupRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

signupRouter.post('/', async (request, response, next) => {

	try {
		const body = request.body

		if(body.password.length < 3 || body.password == undefined) {
			return response.status(500).json({'error': 'Invalid Password'})
		}

		const saltRounds = 10
		const passwordHash = await bcrypt.hash(body.password, saltRounds)

		const user = new User({
			username: body.username,
			firstname: body.firstname,
			lastname: body.lastname,
			email: body.email,
			phone: body.phone,
			passwordHash
		})

		const savedUser = await user.save()

		response.json(savedUser.toJSON())
	} catch (error) {
		next(error)
	}
})

module.exports = signupRouter;