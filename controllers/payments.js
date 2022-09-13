const paymentRouter = require('express').Router()
const razorpay = require('razorpay')
const crypto = require('crypto')

paymentRouter.post('/order', async (request, response) => {
	try {
		const instance = new razorpay({
			key_id: process.env.RAZOR_ID,
			key_secret: process.env.RAZOR_SECRET
		})

		const options = {
			amount: request.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		}

		instance.orders.create(options, (err, order) => {
			if(err){
				console.log(err)
				return res.status(500).json({ message: "Something Went Wrong!"})
			}
			response.status(200).json({data: order})
		})
	} catch(error) {
		console.log(error)
		response.status(500).json({ message: "Internal Server Error!"});
	}
})

paymentRouter.post('/verify', async (request, response) => {
	try {
		const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = request.body;
		const sign = razorpay_payment_id + '|' + razorpay_order_id;
		
		const expectedSign = crypto
			.createHmac("sha256", process.env.RAZOR_SECRET)
			.update(sign.toString())
			.digest("hex");

		console.log(expectedSign)

		if(razorpay_signature === expectedSign) {
			return response.status(200).json({message: "Payment Verification Successful!"})
		} else {
			return response.status(400).json({message: "Payment Verification Failed!"})
		}

	} catch(error) {
		console.log(error)
		response.status(500).json({ message: "Internal Server Error!"});
	}
})

module.exports = paymentRouter
