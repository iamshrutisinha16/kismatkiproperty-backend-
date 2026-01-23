const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

// ✅ Route path "/" because mounted as /api/inquiry
router.post("/", async (req, res) => {
  // Debug: check if req.body is coming
  console.log("Incoming request body:", req.body);

  // Safely destructure with fallback to empty object
  const { name, phone, email, message } = req.body || {};

  if (!name || !phone || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECEIVER,
      subject: "New Property Inquiry",
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Inquiry sent successfully" });
  } catch (error) {
    console.error("Error sending inquiry:", error);
    res.status(500).json({
      error: "Failed to send inquiry",
      details: error.message,
    });
  }
});

module.exports = router;
