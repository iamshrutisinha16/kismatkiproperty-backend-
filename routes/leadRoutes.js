const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");

// Save new lead
router.post("/leads", async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    const lead = new Lead({ mobile });
    await lead.save();

    res.status(201).json({ message: "Lead saved successfully!", lead });
  } catch (err) {
    console.error("Lead save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all leads (optional)
router.get("/leads", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (err) {
    console.error("Fetch leads error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
