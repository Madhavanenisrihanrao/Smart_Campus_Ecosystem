const mongoose = require('mongoose');

/**
 * Lost & Found Item Schema
 * Users can create items, Admin can manage all items
 */
const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['lost', 'found'],
  },
  location: {
    type: String,
    required: [true, 'Please provide a location'],
  },
  contactInfo: {
    type: String,
    required: [true, 'Please provide contact information'],
  },
  status: {
    type: String,
    enum: ['open', 'claimed', 'resolved'],
    default: 'open',
  },
  // Reference to the user who created this item
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Item', itemSchema);
