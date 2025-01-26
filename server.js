const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bookRoutes = require('./routes/bookRoutes');
const audioRoutes = require('./routes/audioRoutes');
const exchangeRoutes = require('./routes/exchangeRoutes'); // Import exchange routes
const authRoutes = require('./routes/authRoutes'); // Import authentication routes

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for all origins

// Static File Serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve image files
app.use('/audio', express.static(path.join(__dirname, 'audio'))); // Serve audio files

// API Routes
app.use('/api/books', bookRoutes); // Book-related routes
app.use('/api/audiobooks', audioRoutes); // Audiobooks-related routes
app.use('/api/exchange', exchangeRoutes); // Book Exchange routes
app.use('/api/auth', authRoutes); // Authentication routes

// Default route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Book Exchange API');
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('DB Connection Error:', err.message);
    process.exit(1); // Exit the application if DB connection fails
  });

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message || err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
