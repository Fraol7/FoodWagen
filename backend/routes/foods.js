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
  console.log('Received POST request to create food:', req.body);
  
  const food = {
    name: req.body.name,
    price: req.body.price,
    rating: req.body.rating || 0,
    image: req.body.image || '/placeholder.svg',
    restaurant: req.body.restaurant,
    status: req.body.status || 'Open',
    logo: req.body.logo || '🍽️',
    category: req.body.category,
    deliveryType: req.body.deliveryType || 'Delivery'
  };

  // Validate required fields
  if (!food.name || !food.price || !food.restaurant) {
    console.error('Validation failed - Missing required fields:', food);
    return res.status(400).json({ 
      message: 'Missing required fields: name, price, and restaurant are required' 
    });
  }

  try {
    console.log('Creating new food item in database...');
    const newFood = await Food.create(food);
    console.log('Successfully created food item:', newFood);
    res.status(201).json(newFood);
  } catch (err) {
    console.error('Error creating food item:', err);
    res.status(400).json({ 
      message: err.message,
      error: err,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
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
router.delete('/:id', async (req, res) => {
  try {
    const foodId = req.params.id;
    console.log('Deleting food item:', foodId);
    
    // First check if the food exists
    const food = await Food.findById(foodId);
    if (!food) {
      console.log('Food item not found:', foodId);
      return res.status(404).json({
        success: false,
        message: 'Food item not found',
        id: foodId
      });
    }
    
    // If it exists, delete it
    await Food.deleteOne({ _id: foodId });
    
    console.log('Successfully deleted food item:', foodId);
    res.status(200).json({ 
      success: true,
      message: 'Food item deleted successfully',
      id: foodId
    });
  } catch (err) {
    console.error('Error deleting food item:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete food item',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

async function getFood(req, res, next) {
  let food;
  try {
    food = await Food.findById(req.params.id);
    if (food == null) {
      return res.status(404).json({ 
        success: false,
        message: 'Food item not found',
        id: req.params.id
      });
    }
  } catch (err) {
    return res.status(500).json({ 
      success: false,
      message: 'Error finding food item',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  res.food = food;
  next();
}

module.exports = router;
