const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Adjust path if needed

router.post('/signup', async (req, res) => {
    const { name, phoneno, email, aadhar, password } = req.body;

    try {
        // Step 1: Check if the user already exists
        const existingUser = await User.findOne({ phoneno });
        if (existingUser) {
            return res.render('errorsignup', { message: 'User already exists.', error: true });
        }

        // Step 2: Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Step 3: Create a new user
        const newUser = new User({
            name,
            phoneno,
            email,
            aadhar,
            password: hashedPassword,
        });

        // Save the new user
        await newUser.save();

        // Automatically log in the user after signup (optional)
        req.session.user = newUser;

        // Redirect to the user's home page
        res.redirect('/home');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user.');
    }
});

module.exports = router;
