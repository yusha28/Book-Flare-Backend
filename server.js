const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bookRoutes = require('./routes/bookRoutes');
const audioRoutes = require('./routes/audioRoutes');
const exchangeRoutes = require('./routes/exchangeRoutes');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for all origins

// Ensure the uploads directory exists
const uploadsPath = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

// Ensure the audio directory exists
const audioPath = path.resolve(__dirname, 'audio');
if (!fs.existsSync(audioPath)) {
  fs.mkdirSync(audioPath);
}

// Static File Serving
app.use('/uploads', express.static(uploadsPath)); // Serve image files
app.use('/audio', express.static(audioPath)); // Serve audio files

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

// Handle 404 Errors
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
