const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Ensure dotenv is loaded to read environment variables
require('dotenv').config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'default_name',
  api_key: process.env.CLOUD_API_KEY || 'default_api_key',
  api_secret: process.env.CLOUD_API_SECRET || 'default_api_secret',
});

// Check if Cloudinary is configured correctly
if (!process.env.CLOUD_API_KEY || !process.env.CLOUD_NAME || !process.env.CLOUD_API_SECRET) {
  console.error('Cloudinary configuration missing. Check .env file.');
}

// Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bookstore',  // Folder in Cloudinary to save images
    format: async (req, file) => 'jpg',  // Save as JPG (can switch to png if required)
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,  // Unique ID using timestamp
    transformation: [{ width: 500, height: 500, crop: 'limit' }],  // Optional: Resize or crop uploaded images
  },
});

// Multer Middleware for File Uploads
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG and PNG are allowed.'));
    }
  }
});

module.exports = { cloudinary, upload };
