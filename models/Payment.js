const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  token: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', PaymentSchema);
