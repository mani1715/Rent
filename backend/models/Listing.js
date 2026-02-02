const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['room', 'house', 'lodge']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  squareFeet: {
    type: Number,
    required: [true, 'Square feet is required'],
    min: 0
  },
  facilities: {
    type: [String],
    default: []
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    trim: true
  },
  bedrooms: {
    type: Number,
    default: 1
  },
  bathrooms: {
    type: Number,
    default: 1
  },
  availableFrom: {
    type: Date
  },
  status: {
    type: String,
    enum: ['available', 'rented', 'unavailable'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
listingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Listing', listingSchema);
