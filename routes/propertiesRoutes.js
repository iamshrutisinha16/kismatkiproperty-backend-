const express = require("express");
const router = express.Router();
const Properties = require("../models/Properties");
const upload = require("../config/multer");

// =======================
// GET ALL PROPERTIES
// =======================
router.get("/properties", async (req, res) => {
  try {
    const data = await Properties.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// ADD PROPERTY (CLOUD IMAGE)
// =======================
router.post("/properties", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const newData = new Properties({
      image: req.file.path, // ✅ Cloudinary URL auto save
      title: req.body.title,
      location: req.body.location,
      bedrooms: Number(req.body.bedrooms) || 0,
      price: req.body.price,
      area: req.body.area,
      tag: req.body.tag,
      type: req.body.type,
    });

    await newData.save();

    res.status(201).json({
      message: "✅ Property Added Successfully",
      data: newData,
    });

  } catch (err) {
    console.error("ADD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// =======================
// DELETE PROPERTY
// =======================
router.delete("/properties/:id", async (req, res) => {
  try {
    await Properties.findByIdAndDelete(req.params.id);

    res.json({
      message: "🗑️ Property Deleted Successfully",
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// =======================
// UPDATE PROPERTY
// =======================
router.put("/properties/:id", async (req, res) => {
  try {
    const updated = await Properties.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        location: req.body.location,
        bedrooms: Number(req.body.bedrooms) || 0,
        price: req.body.price,
        area: req.body.area,
        tag: req.body.tag,
        type: req.body.type,
      },
      { new: true }
    );

    res.json({
      message: "✏️ Property Updated Successfully",
      data: updated,
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;