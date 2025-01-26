const mongoose = require('mongoose');

const exchangeBookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  summary: { type: String, required: true },
  condition: { type: String, enum: ['new', 'old'], required: true },
  price: { type: Number, required: true },
  terms: { type: String, required: true },
  image: { type: String, required: true }, // Image path
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User reference
  status: { type: String, enum: ['available', 'exchanged'], default: 'available' }, // Exchange status
});

module.exports = mongoose.model('ExchangeBook', exchangeBookSchema);
