const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

// Set up storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the 'uploads' directory exists
    cb(null, './public/images/uploads');  // Define folder for saving uploaded images
  },
  filename: function (req, file, cb) {
    // Generate a random filename with original extension
    crypto.randomBytes(12, function (err, buffer) {
      if (err) return cb(err);  // Handle error if random generation fails
      const filename = buffer.toString('hex') + path.extname(file.originalname);
      cb(null, filename);
    });
  }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
