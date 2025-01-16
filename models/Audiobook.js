const mongoose = require('mongoose');

const audiobookSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Audiobook title
  author: { type: String, required: true }, // Author name
  price: { type: Number, required: true }, // Price
  description: { type: String }, // Description of the audiobook
  image: { type: String, required: true }, // Image file path (e.g., "/uploads/image.jpg")
  chapters: [
    {
      title: { type: String }, // Chapter title
      audioSrc: { type: String }, // Audio file path (e.g., "/audio/book1/chapter1.mp3")
    },
  ],
});

module.exports = mongoose.model('Audiobook', audiobookSchema);
