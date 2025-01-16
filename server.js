const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bookRoutes = require('./routes/bookRoutes');
const audioRoutes = require('./routes/audioRoutes'); // Import audio routes

// Load environment variables
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// **Place the static file serving middleware here**
app.use('/audio', express.static(path.join(__dirname, 'audio'))); // Serve audio files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve image files

// Routes
app.use('/api/books', bookRoutes); // Book-related routes
app.use('/api/audiobooks', audioRoutes); // Audiobooks-related routes

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('DB Connection Error:', err));

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
