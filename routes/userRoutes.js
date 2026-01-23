const express = require('express');
const router = express.Router();
const User = require('../models/user'); // passport-local-mongoose
const nodemailer = require('nodemailer');
require('dotenv').config();

// ✅ Email sender function
async function sendSignupEmail(user) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: `"Kismat Ki Property" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER, // Sir ka email
    subject: "🚀 New User Signup",
    text: `A new user has registered:\n\nUsername: ${user.username}\nEmail: ${user.email}`,
  };

  await transporter.sendMail(mailOptions);
}

// ✅ Signup route with email notification only
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, email });

    User.register(newUser, password, async (err, user) => {
      if (err) {
        console.error('Register error:', err);
        return res.status(500).json({ message: 'Signup failed' });
      }

      try {
        //  Email Notification
        await sendSignupEmail(user);
        console.log("Signup email sent successfully!");
      } catch (notifyErr) {
        console.error("Email notification error:", notifyErr);
      }

      res.status(201).json({ message: 'User registered successfully & email notification sent!' });
    });
  } catch (err) {
    console.error('Signup exception:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

module.exports = router;
