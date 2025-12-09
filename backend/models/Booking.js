const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  visitorName: {
    type: String,
    required: [true, 'Visitor name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  visitDate: {
    type: Date,
    required: [true, 'Visit date is required']
  },
  numberOfVisitors: {
    type: Number,
    required: [true, 'Number of visitors is required'],
    min: [1, 'At least 1 visitor required'],
    max: [20, 'Maximum 20 visitors per booking']
  },
  tourType: {
    type: String,
    required: [true, 'Tour type is required'],
    enum: ['guided', 'self-guided', 'private']
  },
  specialRequests: {
    type: String,
    trim: true,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
