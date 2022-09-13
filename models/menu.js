const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    name: String,
    imgSrc: String,
    price: Number,
    seller: {
    	type: mongoose.Schema.Types.ObjectId,
    	ref: 'Seller'
 	}
});

menuSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Menu", menuSchema);
