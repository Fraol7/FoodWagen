const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  image: { type: String, default: '/placeholder.svg' },
  restaurant: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Closed'], default: 'Open' },
  logo: { type: String, default: '🍽️' },
  category: { type: String },
  deliveryType: { type: String, enum: ['Delivery', 'Pickup', 'Both'], default: 'Delivery' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', foodSchema);
