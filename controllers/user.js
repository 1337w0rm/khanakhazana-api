const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require("mongoose");

const User = require('../models/user')
const Menu = require('../models/menu')

userRouter.get('/', async (request, response) => {
	const res = await User.find({})
	response.json(res)
})


userRouter.post('/', async (request, response) => {
	const id = request.body.id
	const qty = request.body.qty
	const token = request.token

	const decodedToken = jwt.verify(token, process.env.SECRET)

	if (!token || !decodedToken.id)
		return response.status(401).json({ error: 'token missing or invalid' })

	const user = await User.findById(decodedToken.id)
	const item = await Menu.findById(id)

	const newItem = {
		item: item._id,
		qty: qty 
	}

	try {
		user.cart = user.cart.concat(newItem)
        const res = await user.save({
    		validateModifiedOnly: true,
		});
        response.status(200).send("Success");
    } catch (e) {
    	console.log(e)
        response.status(404).send("Item not found. Invalid ID");
    }
})

userRouter.post('/favourite/:id', async (request, response) => {
	const id = request.params.id
	const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    const user = await User.findById(decodedToken.id)

    


})

userRouter.get('/cart', async (request, response) => {
	const token = request.token

	const decodedToken = jwt.verify(token, process.env.SECRET)

	if (!token || !decodedToken.id)
		return response.status(401).json({ error: 'token missing or invalid' })

	const user = await User.findById(decodedToken.id).populate({
		path: 'cart',
	    populate: {
			path: 'item',
			model: 'Menu'
	    } 
	})

	response
    .status(200)
    .json({ cart: user.cart })
})


userRouter.delete('/:id', async (request, response) => {
	const id = request.params.id
	const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    const user = await User.findById(decodedToken.id)
    const blogToDelete = await User.findOneAndUpdate(
    	{_id: decodedToken.id},
    	{$pull: {cart: {item: id}}},
    	{safe: true, multi: false}
    )

    return response.status(200).json({ message: "Album Deleted Successfully" });

})

userRouter.put('/:type/:id', async (request, response) => {
	const type = request.params.type
	const id = request.params.id

	const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

	if(type == 'inc'){
		const res = await User.updateOne(
			{"_id": decodedToken.id, "cart.item": id},
			{"$inc": {"cart.$.qty": 1 }}
		)
		return response.status(200).json({ message: "Qty Incremented" });
	}

	if(type == 'dec'){
		const res = await User.updateOne(
			{"_id": decodedToken.id, "cart.item": id},
			{"$inc": {"cart.$.qty": -1 }}
		)
		return response.status(200).json({ message: "Quantity Decremented" });
	}

})

module.exports = userRouter;
