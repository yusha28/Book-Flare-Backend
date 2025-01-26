const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  try {
    // Check if the authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extract the token from the header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the ID from the decoded token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found. Unauthorized.' });
      }

      // Pass control to the next middleware or route handler
      next();
    } else {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
  } catch (error) {
    // Handle specific token errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Unauthorized.' });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }

    // Handle any other server errors
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = { protect };
