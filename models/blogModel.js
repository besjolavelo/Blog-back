const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  id: String,
  name: String,
  url: String,
  description: String
});

module.exports = mongoose.model('Blog', blogSchema);
