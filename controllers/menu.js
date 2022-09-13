const menuRouter = require("express").Router();
const Menu = require("../models/menu");
const Seller = require("../models/seller");

menuRouter.get("/", async (request, response) => {
    const res = await Menu.find({}).populate('seller', { name: 1 });
    response.json(res.map((r) => r.toJSON()));
});

menuRouter.get('/search', async (request, response) => {
    const query = request.query.query
    const res = await Menu.find({"name": {$regex: query, $options: 'i'}})
    response.status(200).json(res.map((r) => r.toJSON())); 
})

menuRouter.delete("/:id", async (request, response) => {
    const id = request.params.id;
    const item = Menu.findById(id);

    await item.deleteOne();
    response.status(200).send("Deleted Successfully");
});

menuRouter.post("/", async (request, response) => {
    const body = request.body;
    const seller = await Seller.findById(body.seller)
    console.log(seller)
    const menu = new Menu({
        name: body.name,
        imgSrc: body.imgSrc,
        price: body.price,
        ratings: body.ratings,
        quantity: body.quantity,
        seller: seller._id,
    });

    const res = await menu.save();
    seller.menu = seller.menu.concat(res._id);
    await seller.save();
    response.json(res);
});

menuRouter.put("/:id", async (request, response) => {
    const id = request.params.id;
    const body = request.body;
    const item = await Menu.findById(id);

    try {
        Object.assign(item, body);
        await item.save();
        response.status(200).send("Success");
    } catch (e) {
        response.status(404).send("Item not found. Invalid ID");
    }
});

module.exports = menuRouter;
