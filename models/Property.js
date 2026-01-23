const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },       // Short title (e.g. 3 BHK Flat in Preet Vihar)
  description: { type: String },                 // Full details
  price: { type: String, required: true },       // Price (string so "3 Cr" bhi chale)
  area: { type: String },                        // e.g. "200 sq. yard"
  bedrooms: { type: Number },                    // No. of bedrooms (optional)
  bathrooms: { type: Number },                   // No. of bathrooms
  location: { type: String },                    // City/Address
  tag: { type: String },                         // Buy / Rent / Commercial / etc.
  category: { type: String },                    // Apartment / Plot / Villa / Office
  image: { type: String },                       // Uploaded image path
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Property", propertySchema);
