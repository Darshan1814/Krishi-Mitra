const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    // Organize uploads by type
    if (file.fieldname === 'avatar') {
      uploadPath += 'avatars/';
    } else if (file.fieldname === 'cropImages') {
      uploadPath += 'crops/images/';
    } else if (file.fieldname === 'cropVideos') {
      uploadPath += 'crops/videos/';
    } else if (file.fieldname === 'kycDocuments') {
      uploadPath += 'kyc/';
    } else if (file.fieldname === 'certificates') {
      uploadPath += 'certificates/';
    } else {
      uploadPath += 'others/';
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.fieldname === 'avatar') {
    // Only images for avatars
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for avatar'), false);
    }
  } else if (file.fieldname === 'cropImages') {
    // Only images for crop images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for crop images'), false);
    }
  } else if (file.fieldname === 'cropVideos') {
    // Only videos for crop videos
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed for crop videos'), false);
    }
  } else if (file.fieldname === 'kycDocuments') {
    // Images and PDFs for KYC documents
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed for KYC documents'), false);
    }
  } else if (file.fieldname === 'certificates') {
    // Images and PDFs for certificates
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed for certificates'), false);
    }
  } else {
    cb(null, true);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  }
});

// Upload configurations for different scenarios
const uploadConfigs = {
  avatar: upload.single('avatar'),
  cropListing: upload.fields([
    { name: 'cropImages', maxCount: 10 },
    { name: 'cropVideos', maxCount: 3 },
    { name: 'certificates', maxCount: 5 }
  ]),
  kycDocuments: upload.fields([
    { name: 'aadharCard', maxCount: 2 },
    { name: 'panCard', maxCount: 2 },
    { name: 'bankDetails', maxCount: 2 }
  ]),
  chat: upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 },
    { name: 'files', maxCount: 3 }
  ])
};

module.exports = {
  upload,
  uploadConfigs
};
