const mongoose = require('mongoose');

const exchangeRequestSchema = new mongoose.Schema(
  {
    requestedBookID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExchangeBook',
      required: true,
    },
    offeredBookID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExchangeBook',
      required: true,
    },
    requesterID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined', 'Completed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExchangeRequest', exchangeRequestSchema);
