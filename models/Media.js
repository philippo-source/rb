const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  id: String,
  mediaType: String,
  source: String,
  title: String,
  description: String,
  length: String,
  aspectRatio: String,
  topic: String,
  contentUrl: String,
  previewUrl: String,
  rating: Number,
  ratingAmount: Number


});


module.exports = mongoose.model('Media', UserSchema);