const mongoose = require('mongoose');

const audiobookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String, // Path to the image
    required: true,
  },
  chapters: [
    {
      title: { type: String },
      audioSrc: { type: String }, // Path to the audio file
    },
  ],
});

module.exports = mongoose.model('Audiobook', audiobookSchema);
