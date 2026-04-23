const mongoose = require('mongoose');

const propertiesSchema = new mongoose.Schema({
  image: String,
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