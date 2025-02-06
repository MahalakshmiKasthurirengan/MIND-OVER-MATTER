const mongoose = require("mongoose");

// Define the Signup schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneno: {
        type: String,
        unique: true,
        required: true,
        match: /^[0-9]{10}$/
    },
    email: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    aadhar: {
        type: String,
        required: true,
        match: /^[0-9]{12}$/
    },
    password: {
        type: String,
        required: true
    }
});

// Create the model from the schema
const User = mongoose.model("User", UserSchema);

module.exports = User;
