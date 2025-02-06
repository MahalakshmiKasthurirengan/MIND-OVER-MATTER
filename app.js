// Import necessary modules
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./models/userModel');
const Review = require('./models/reviewModel');

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware for parsing incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up view engine and static files
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session setup
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Change to true with HTTPS in production
}));

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/MOM')
.then(() => console.log('Database connected successfully'))
.catch((err) => console.error('Database connection error:', err));

// Routes
app.get('/', (req, res) => res.render('landing'));

app.get('/login', (req, res) => res.render('login'));

app.get('/signup', (req, res) => res.render('signup'));

app.get('/aboutus', (req, res) => res.render('aboutus'));

app.get('/doctorList', (req, res) => {
    try {
        res.render('doctorList');
    } catch (error) {
        console.error('Error rendering doctor list page:', error);
        res.status(500).send('Error loading doctor list page');
    }
});

app.get('/inTake', (req, res) => {
    try {
        res.render('inTake');
    } catch (error) {
        console.error('Error rendering IN-Take page:', error);
        res.status(500).send('Error loading In-Take page');
    }
});



// Public Reviews Page Route
app.get('/reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.render('reviews', { reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).send('Error loading reviews');
    }
});

// Submit Review Route
app.post('/submitreview', async (req, res) => {
    const { reviewerName, reviewerEmail, reviewStartingStage, reviewEndingStage, reviewDuration, reviewContent } = req.body;

    try {
        const newReview = new Review({
            reviewerName,
            reviewerEmail,
            reviewStartingStage,
            reviewEndingStage,
            reviewDuration,
            reviewContent
        });

        await newReview.save();
        res.redirect('/addreview?success=1');
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).send('Error submitting review');
    }
});

// Add Review Page
app.get('/addreview', (req, res) => {
    const successMessage = req.query.success ? 'Review submitted successfully!' : null;
    res.render('addreview', { success: successMessage });
});

app.get('/discover', (req, res) => {
    try {
        res.render('discover');
    } catch (error) {
        console.error('Error rendering discover page:', error);
        res.status(500).send('Error rendering discover page');
    }
});

// Register User Route
app.post('/signup', async (req, res) => {
    const { name, phoneno, email, aadhar, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ phoneno });
        if (existingUser) {
            return res.render('errorsignup', { message: 'User already exists' });
        }

        // Hash the password for secure storage
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = new User({
            name,
            phoneno,
            email,
            aadhar,
            password: hashedPassword,
        });

        await newUser.save(); // Save the user to the database

        // Set the user session and redirect to home
        req.session.user = newUser;
        return res.redirect('/home');
    } catch (error) {
        console.error('Error during signup:', error);
        // Render a user-specific error page
        return res.status(500).render('errorsignup', { message: 'Error during signup. Please try again.' });
    }
});


// Login User Route
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ phoneno: req.body.phoneno });
        if (!user) {
            return res.render('wronguser', { message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (isPasswordValid) {
            req.session.user = user;
            res.redirect('/home');
        } else {
            res.render('wrongpass', { message: 'Wrong password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error during login');
    }
});

// Home Page Route
app.get('/home', (req, res) => {
    if (req.session.user) {
        res.render('home', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).send('Error during logout');
        }
        res.redirect('/');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
