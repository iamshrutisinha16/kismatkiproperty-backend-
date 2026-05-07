const mongoose = require('mongoose');

const propertiesSchema = new mongoose.Schema({
  image: String,
  type: { type: String, enum: ['Buy', 'Rent', 'New Launch', 'Commercial', 'Projects'], required: true },
  title: String,
  location: String,
  bedrooms: Number,
  price: String,
  area: String,
  tag: String,
}, { timestamps: true });

module.exports =
  mongoose.models.Properties ||
  mongoose.model("Properties", propertiesSchema);