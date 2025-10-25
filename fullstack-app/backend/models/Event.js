const mongoose = require('mongoose');

/**
 * Event Schema
 * Users can view events, Admin can create/edit/delete events
 */
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide an event description'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide an event date'],
  },
  time: {
    type: String,
    required: [true, 'Please provide an event time'],
  },
  location: {
    type: String,
    required: [true, 'Please provide an event location'],
  },
  organizer: {
    type: String,
    required: [true, 'Please provide organizer name'],
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming',
  },
  // Reference to the admin who created this event
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Event', eventSchema);
