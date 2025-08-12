const Contact = require('../models/Contact');
const asyncHandler = require('express-async-handler');

// @desc    Create a new contact submission
// @route   POST /api/contact
// @access  Public
const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Please provide name, email and message');
  }

  // Create contact submission
  const contact = await Contact.create({
    name,
    email,
    phone,
    message
  });

  if (contact) {
    res.status(201).json({
      success: true,
      data: contact
    });
  } else {
    res.status(400);
    throw new Error('Invalid contact data');
  }
});

// @desc    Get all contact submissions
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts
  });
});

// @desc    Get single contact submission
// @route   GET /api/contact/:id
// @access  Private/Admin
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  
  if (contact) {
    res.status(200).json({
      success: true,
      data: contact
    });
  } else {
    res.status(404);
    throw new Error('Contact submission not found');
  }
});

// @desc    Update contact submission status
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContact = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  // Find contact submission
  let contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact submission not found');
  }
  
  // Update status
  contact.status = status || contact.status;
  
  // Save updated contact
  contact = await contact.save();
  
  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Delete contact submission
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  
  if (!contact) {
    res.status(404);
    throw new Error('Contact submission not found');
  }
  
  await contact.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

module.exports = {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact
};