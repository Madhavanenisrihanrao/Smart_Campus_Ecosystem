const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/items
 * @desc    Get all items (Lost & Found)
 * @access  Private (All authenticated users)
 */
router.get('/', protect, async (req, res) => {
  try {
    const items = await Item.find().populate('user', 'name email').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/items/my-items
 * @desc    Get current user's items
 * @access  Private
 */
router.get('/my-items', protect, async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/items
 * @desc    Create a new item
 * @access  Private (All authenticated users)
 */
router.post('/', protect, async (req, res) => {
  try {
    // Add user ID to request body
    req.body.user = req.user._id;

    const item = await Item.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   PUT /api/items/:id
 * @desc    Update an item
 * @access  Private (Owner or Admin)
 */
router.put('/:id', protect, async (req, res) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Check if user is item owner or admin
    if (item.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item',
      });
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   DELETE /api/items/:id
 * @desc    Delete an item
 * @access  Private (Owner or Admin)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Check if user is item owner or admin
    if (item.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item',
      });
    }

    await Item.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
