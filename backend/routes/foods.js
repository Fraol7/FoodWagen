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
    rating: req.body.rating,
    image: req.body.image,
    restaurant: req.body.restaurant
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
  if (req.body.name != null) {
    res.food.name = req.body.name;
  }
  if (req.body.rating != null) {
    res.food.rating = req.body.rating;
  }
  if (req.body.image != null) {
    res.food.image = req.body.image;
  }
  if (req.body.restaurant != null) {
    res.food.restaurant = req.body.restaurant;
  }
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
