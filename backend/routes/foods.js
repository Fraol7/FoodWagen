const express = require('express');
const router = express.Router();
const Food = require('../models/food');

// Get all foods
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one food
router.get('/:id', getFood, (req, res) => {
  res.json(res.food);
});

// Create one food
router.post('/', async (req, res) => {
  const food = new Food({
    name: req.body.name,
    price: req.body.price,
    rating: req.body.rating || 0,
    image: req.body.image || '/placeholder.svg',
    restaurant: req.body.restaurant,
    status: req.body.status || 'Open',
    logo: req.body.logo || '🍽️',
    category: req.body.category,
    deliveryType: req.body.deliveryType || 'Delivery'
  });

  try {
    const newFood = await food.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one food
router.patch('/:id', getFood, async (req, res) => {
  const allowedUpdates = ['name', 'price', 'rating', 'image', 'restaurant', 'status', 'logo', 'category', 'deliveryType'];
  
  // Only update fields that are passed in the request and are allowed
  Object.keys(req.body).forEach(update => {
    if (allowedUpdates.includes(update)) {
      res.food[update] = req.body[update];
    }
  });
  
  res.food.updatedAt = Date.now();

  try {
    const updatedFood = await res.food.save();
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one food
router.delete('/:id', getFood, async (req, res) => {
  try {
    await res.food.remove();
    res.json({ message: 'Deleted Food' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getFood(req, res, next) {
  let food;
  try {
    food = await Food.findById(req.params.id);
    if (food == null) {
      return res.status(404).json({ message: 'Cannot find food' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.food = food;
  next();
}

module.exports = router;
