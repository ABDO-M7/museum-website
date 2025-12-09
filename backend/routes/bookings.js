const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// @route   POST /api/bookings
// @desc    Create a new booking
router.post('/', async (req, res) => {
  try {
    const { visitorName, email, phone, visitDate, numberOfVisitors, tourType, specialRequests } = req.body;

    // Server-side validation
    if (!visitorName || !email || !phone || !visitDate || !numberOfVisitors || !tourType) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields' 
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }

    // Validate visit date is in the future
    const selectedDate = new Date(visitDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(400).json({ 
        success: false, 
        message: 'Visit date must be in the future' 
      });
    }

    // Create new booking
    const booking = new Booking({
      visitorName,
      email,
      phone,
      visitDate: selectedDate,
      numberOfVisitors: parseInt(numberOfVisitors),
      tourType,
      specialRequests
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      data: savedBooking
    });

  } catch (error) {
    console.error('Booking error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false, 
        message: messages.join(', ') 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
