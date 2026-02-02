const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authMiddleware, requireRole } = require('../middleware/auth');
const Review = require('../models/Review');
const Listing = require('../models/Listing');

// @route   POST /api/reviews
// @desc    Create a review for a listing
// @access  Private
router.post(
  '/',
  [
    authMiddleware,
    requireRole,
    body('listingId').notEmpty().withMessage('Listing ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { listingId, rating, comment } = req.body;

      // Check if listing exists
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ 
          success: false, 
          message: 'Listing not found' 
        });
      }

      // Check if user is trying to review their own listing
      if (listing.ownerId.toString() === req.user._id.toString()) {
        return res.status(400).json({ 
          success: false, 
          message: 'You cannot review your own listing' 
        });
      }

      // Check if user has already reviewed this listing
      const existingReview = await Review.findOne({ 
        listingId, 
        userId: req.user._id 
      });

      if (existingReview) {
        return res.status(400).json({ 
          success: false, 
          message: 'You have already reviewed this listing' 
        });
      }

      // Create review
      const review = new Review({
        listingId,
        userId: req.user._id,
        rating,
        comment: comment || ''
      });

      await review.save();
      await review.populate('userId', 'name');

      res.status(201).json({
        success: true,
        message: 'Review added successfully',
        review
      });
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error' 
      });
    }
  }
);

// @route   GET /api/reviews/listing/:listingId
// @desc    Get all reviews for a listing
// @access  Public
router.get('/listing/:listingId', async (req, res) => {
  try {
    const reviews = await Review.find({ listingId: req.params.listingId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      count: reviews.length,
      averageRating: avgRating.toFixed(1),
      reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/reviews/user
// @desc    Get all reviews by current user
// @access  Private
router.get('/user', authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate('listingId', 'title type location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private (Own reviews only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this review' 
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
