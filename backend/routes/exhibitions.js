const express = require('express');
const router = express.Router();
const Exhibition = require('../models/Exhibition');

// @route   GET /api/exhibitions
// @desc    Get all exhibitions
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const exhibitions = await Exhibition.find(query).sort({ startDate: -1 });
    res.json({
      success: true,
      count: exhibitions.length,
      data: exhibitions
    });
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/exhibitions/:id
// @desc    Get single exhibition
router.get('/:id', async (req, res) => {
  try {
    const exhibition = await Exhibition.findById(req.params.id);
    
    if (!exhibition) {
      return res.status(404).json({ 
        success: false, 
        message: 'Exhibition not found' 
      });
    }

    res.json({
      success: true,
      data: exhibition
    });
  } catch (error) {
    console.error('Error fetching exhibition:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/exhibitions
// @desc    Create new exhibition (admin)
router.post('/', async (req, res) => {
  try {
    const exhibition = new Exhibition(req.body);
    const savedExhibition = await exhibition.save();

    res.status(201).json({
      success: true,
      message: 'Exhibition created successfully',
      data: savedExhibition
    });
  } catch (error) {
    console.error('Error creating exhibition:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ') 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
