const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bookRoutes = require('./routes/bookRoutes');
const audioRoutes = require('./routes/audioRoutes'); // Import audio routes

// Load environment variables
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Static File Serving for Audio and Uploaded Files
app.use('/audio', express.static(path.join(__dirname, 'audio'))); // Preloaded audio files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Uploaded files via admin panel

// Book Routes
app.use('/api/books', bookRoutes); // Register book routes

// Audiobooks Metadata API (Dynamic Reading of Audio Files)
app.get('/api/audiobooks', (req, res) => {
  const audioDir = path.join(__dirname, 'audio');
  const audioBooks = [];

  // Check if the audio directory exists
  if (fs.existsSync(audioDir)) {
    // Dynamically read directories for audiobooks
    fs.readdirSync(audioDir).forEach((bookDir) => {
      const bookPath = path.join(audioDir, bookDir);

      if (fs.lstatSync(bookPath).isDirectory()) {
        const chapters = [];
        fs.readdirSync(bookPath).forEach((file) => {
          if (file.endsWith('.mp3')) {
            chapters.push({
              title: file.replace('.mp3', ''), // Remove file extension
              audioSrc: `/audio/${bookDir}/${file}`, // Construct path to audio file
            });
          }
        });

        audioBooks.push({
          title: bookDir.replace(/_/g, ' '), // Convert folder name to readable title
          chapters,
        });
      }
    });

    res.json(audioBooks); // Return audiobook metadata as JSON
  } else {
    res.status(404).json({ error: 'Audio directory not found' });
  }
});

// Audio Routes (For handling audiobooks with file uploads and metadata)
app.use('/api/audiobooks', audioRoutes); // Register audio routes

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('DB Connection Error:', err));

// Default Route for Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
