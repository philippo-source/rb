const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

  userId: String,
  rating: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },


}, {
  versionKey: false // no versioning needed as unique values
});


module.exports = mongoose.model('Rating', UserSchema);