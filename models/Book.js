const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
  genre: String,
  rating: Number,
  image: String,
  summary: String,
  reviews: [
    {
      reviewer: String,
      comment: String,
      rating: Number,
    }
  ]
});

module.exports = mongoose.model('Book', bookSchema);
