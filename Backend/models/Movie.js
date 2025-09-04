const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['movie', 'show'],
    required: true
  },
  director: {
    type: String,
    trim: true
  },
  budget: {
    type: Number,
    min: 0
  },
  location: {
    type: String,
    trim: true
  },
  duration: {
    type: Number,
    min: 0
  },
  year: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear()
  },
  description: {
    type: String,
    trim: true
  },
  poster: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Movie', movieSchema);
