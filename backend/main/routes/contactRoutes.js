const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController');

// Middleware for protecting routes (to be implemented)
// const { protect, admin } = require('../middleware/authMiddleware');

// Public route for creating contact submissions
router.route('/').post(createContact);

// Admin routes for managing contact submissions
// In a real app, these would be protected with middleware
router.route('/').get(getContacts);
router.route('/:id').get(getContact).put(updateContact).delete(deleteContact);

module.exports = router;