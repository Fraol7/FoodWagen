const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  image: { type: String },
  restaurant: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Food = mongoose.model('Food', foodSchema);
