const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
    name: String,
    menu: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: 'Menu'
 		}
    ]
});

sellerSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Seller", sellerSchema);
