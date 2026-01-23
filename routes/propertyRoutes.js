const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const Property = require("../models/Property");

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// CREATE property (with multiple images)
router.post("/properties", upload.array("images", 10), async (req, res) => {
  try {
    const images = req.files.map(file => file.path); // multiple images
    const newProperty = new Property({
      ...req.body,
      images,
      image: images[0] // main image for listing
    });
    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (err) {
    console.error("Create property error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all properties with filters/search (supports multiple locations)
router.get("/properties", async (req, res) => {
  try {
    let { location, tag, bedrooms, minPrice, maxPrice } = req.query;
    let filters = {};

    // Multiple locations support
    if(location){
      const locationsArray = location.split(",").map(loc => loc.trim());
      filters.$or = locationsArray.map(loc => ({
        location: { $regex: loc, $options: "i" }
      }));
    }

    if(tag) filters.tag = tag;
    if(bedrooms) filters.bedrooms = Number(bedrooms);
    if(minPrice || maxPrice){
      filters.price = {};
      if(minPrice) filters.price.$gte = Number(minPrice);
      if(maxPrice) filters.price.$lte = Number(maxPrice);
    }

    const properties = await Property.find(filters).sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (err) {
    console.error("Get properties error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET single property by ID
router.get("/properties/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if(!property) return res.status(404).json({ message: "Property not found" });
    res.status(200).json(property);
  } catch (err) {
    console.error("Get property error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE property (also remove images)
router.delete("/properties/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if(!property) return res.status(404).json({ message: "Property not found" });

    // Delete images from disk
    if(property.images && property.images.length){
      property.images.forEach(imgPath => {
        fs.unlink(imgPath, err => {
          if(err) console.error("Image deletion error:", err);
        });
      });
    }

    await property.deleteOne();
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("Delete property error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
