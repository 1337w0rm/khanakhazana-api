const sellerRouter = require("express").Router();
const Seller = require("../models/seller");

sellerRouter.get("/", async (request, response) => {
    const res = await Seller.find({}).populate('menu', { name: 1, price: 1 });
    response.json(res.map(r => r.toJSON()));
});

module.exports = sellerRouter;