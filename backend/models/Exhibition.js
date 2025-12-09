const mongoose = require('mongoose');

const exhibitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Exhibition title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['ancient', 'modern', 'contemporary', 'special'],
    default: 'modern'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Exhibition', exhibitionSchema);
