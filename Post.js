const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userName: String,
  content: String,
  audience: String,
  allowComments: Boolean,
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);
