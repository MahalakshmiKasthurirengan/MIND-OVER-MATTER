const express = require('express');
const Review = require('./models/reviewModel'); // Adjust the path as needed
const router = express.Router();

// Route to fetch all reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find(); // Fetch all reviews from the database
        res.render('reviews', { reviews }); // Pass the reviews to the EJS template
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).send('Error fetching reviews');
    }
});

// Route to display the add review page
router.get('/add', (req, res) => {
    const successMessage = req.query.success ? "Review submitted successfully!" : null;
    res.render('addreview', { success: successMessage });
});

// Route to handle submitting a new review
router.post('/submit', async (req, res) => {
    const { reviewerName, reviewStartingStage, reviewEndingStage, reviewDuration, reviewContent } = req.body;

    try {
        const newReview = new Review({
            reviewerName,
            reviewStartingStage,
            reviewEndingStage,
            reviewDuration,
            reviewContent
        });

        // Save the review to the database
        await newReview.save();

        // Redirect to the add review page with a success message
        res.redirect('/reviews/add?success=1');
    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).send('Error submitting review');
    }
});

module.exports = router;
