const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        minLength: [3, 'username is too short'],
        unique: true
    },
    firstname: String,
    lastname: String,
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
        unique: true
    },
    passwordHash: {
        type: String,
        required: [true, 'Please provide a password'],
    },
    cart: [
        { 
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu'   
            },
            qty: {
                type: Number,
                required: true
            }
        }
    ],
    favourite: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu'   
        }
    ]
});

userSchema.plugin(uniqueValidator)

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

module.exports = mongoose.model("User", userSchema);
