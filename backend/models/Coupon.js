const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['percentage', 'fixed'] },
  value: Number,
  minOrder: Number
});

module.exports = mongoose.model('Coupon', couponSchema);
