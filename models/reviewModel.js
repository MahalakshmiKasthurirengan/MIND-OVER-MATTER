const mongoose = require("mongoose");

// Define the Review schema
const ReviewSchema = new mongoose.Schema({
    reviewerName: {
        type: String,
        required: true
    },
    reviewStartingStage: {
        type: String,
        required: true,
    },
    reviewEndingStage: {
        type: String,
        required: true,
    },
    reviewDuration: {
        type: String,
        required: true,
    },
    reviewContent: {
        type: String,
        required: true
    }
});

// Create the model from the schema
const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
