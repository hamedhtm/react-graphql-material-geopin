const mongoose = require('mongoose');

const PinSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    image: String,
    latitude: Number,
    longitude: Number,
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    comment: [
      {
        text: String,
        createdAt: {
          type: Date,
          default: new Date(),
        },
        author: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
      },
    ],
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { timeStamp: true },
);

module.exports = mongoose.model('Pin', PinSchema);
