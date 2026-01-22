const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  customerInfo: {
    name: String,
    phone: String,
    address: String,
    deliveryDate: String,
    deliveryTime: String,
    customMessage: String
  },
  cartItems: [{
    name: String,
    price: Number,
    weight: String,
    quantity: Number,
    type: { type: String },
    itemTotal: Number
  }],
  total: Number,
  discount: { type: Number, default: 0 },
  couponCode: String,
  status: { type: String, default: 'Pending' },
  paymentMethod: String
});

module.exports = mongoose.model('Order', orderSchema);
