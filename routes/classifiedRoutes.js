const express = require("express");
const router = express.Router();
const Classified = require("../models/Classified");
const upload = require("../config/multer");


// ✅ GET ALL
router.get("/classified", async (req, res) => {
  try {
    const data = await Classified.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ ADD
router.post("/classified", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    const newData = new Classified({
      image: req.file.path, // ✅ FIXED
      title: req.body.title,
      location: req.body.location,
      bedrooms: Number(req.body.bedrooms) || 0,
      price: req.body.price,
      agent: req.body.agent,
      contact: [req.body.contact],
    });

    await newData.save();

    res.json({ message: "Added Successfully ✅" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ DELETE
router.delete("/classified/:id", async (req, res) => {
  try {
    await Classified.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully 🗑️" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ UPDATE (EDIT)
router.put("/classified/:id", async (req, res) => {
  try {
    await Classified.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ message: "Updated Successfully ✏️" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;