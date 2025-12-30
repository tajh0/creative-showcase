
const mongoose = require('mongoose');
module.exports = mongoose.model('Image', new mongoose.Schema({
  title: String,
  url: String,
  createdAt: { type: Date, default: Date.now }
}));
