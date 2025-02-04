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
const esewaRoutes = require('./routes/esewaRoutes'); // ✅ Import eSewa routes

// ✅ Load environment variables at the top
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Ensure necessary directories exist
const uploadsPath = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath);

const audioPath = path.resolve(__dirname, 'audio');
if (!fs.existsSync(audioPath)) fs.mkdirSync(audioPath);

// Static File Serving
app.use('/uploads', express.static(uploadsPath));
app.use('/audio', express.static(audioPath));

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/audiobooks', audioRoutes);
app.use('/api/exchange', exchangeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/esewa', esewaRoutes); // ✅ eSewa Payment routes

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('DB Connection Error:', err.message);
    process.exit(1);
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
