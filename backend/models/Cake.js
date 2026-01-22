const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  price: Number,
  weights: [{
    size: String,
    price: Number
  }],
  type: String,
  image: String,
  bestseller: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cake', cakeSchema);
