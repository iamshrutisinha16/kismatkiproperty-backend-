const express = require('express');
const router = express.Router();
const Classified = require("../models/Classified");

// ❌ Galat: const multer = require("../config/multer");
// ✅ Sahi: variable ka naam 'upload' rakhein kyunki niche aapne wahi use kiya hai
const upload = require("../config/multer"); 

router.get("/classified", async (req, res) => {
  try {
    const data = await Classified.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ab ye 'upload' sahi kaam karega kyunki upar humne ise define kar diya hai
router.post("/classified", upload.single("image"), async (req, res) => {
  try {
    // Crash se bachne ke liye check karein ki file aayi hai ya nahi
    if (!req.file) {
      return res.status(400).json({ error: "Please upload an image" });
    }

    const newData = new Classified({
      title: req.body.title,
      location: req.body.location,
      bedrooms: req.body.bedrooms,
      price: req.body.price,
      agent: req.body.agent,
      contact: [req.body.contact],
      image: req.file.path, 
    });

    await newData.save();
    res.json({ message: "Uploaded successfully! ☁️" });

  } catch (err) {
    console.error("Error in upload:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;