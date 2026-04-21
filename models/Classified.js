const mongoose = require('mongoose');
const classifiedSchema = new mongoose.Schema({

image: String,
title: String,
location: String,
bedrooms: Number,
price: String,
agent: String,
 contact: [String],
}, { timestamps: true 
    
});

module.exports = mongoose.model("Classified", classifiedSchema);