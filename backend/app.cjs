const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

// Models
const Cake = require('./models/Cake');
const Order = require('./models/Order');
const Message = require('./models/Message');
const User = require('./models/User');
const Review = require('./models/Review');
const Coupon = require('./models/Coupon');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection (cached and awaited per request)
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.MONGO_URL ||
  process.env.MONO_URL;

let mongoPromise = global._mongoPromise || null;
async function connectDB() {
  if (!MONGO_URI) {
    throw new Error('Missing MongoDB URI. Set MONGO_URI or MONGODB_URI in environment.');
  }
  if (mongoPromise) return mongoPromise;
  mongoPromise = mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 20000
  }).then(conn => {
    global._mongoPromise = conn;
    console.log('MongoDB Connected');
    return conn;
  }).catch(err => {
    console.error('MongoDB Connection Error:', err);
    throw err;
  });
  return mongoPromise;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database connection error', error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send('Shree Bakers Backend is running with MongoDB');
});

// Test route
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Backend is working ✅' });
});

// --- ORDERS ---
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: 1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Track Order
app.post('/api/orders/track', async (req, res) => {
  const { phone } = req.body;
  try {
    const userOrders = await Order.find({ 'customerInfo.phone': phone }).sort({ createdAt: -1 });
    res.json(userOrders);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = await Order.create(req.body);
    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save order', error: err.message });
  }
});

// --- MESSAGES ---
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const newMessage = await Message.create(req.body);
    res.status(201).json({ success: true, message: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save message', error: err.message });
  }
});

// --- CAKES ---
app.get('/api/cakes', async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.json(cakes);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/cakes', async (req, res) => {
  try {
    const newCake = await Cake.create(req.body);
    res.status(201).json({ success: true, cake: newCake });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save cake', error: err.message });
  }
});

app.delete('/api/cakes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCake = await Cake.findByIdAndDelete(id);
    if (!deletedCake) {
      return res.status(404).json({ success: false, message: 'Cake not found' });
    }
    res.json({ success: true, message: 'Cake deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete cake', error: err.message });
  }
});

// --- USERS ---
app.post('/api/users/login', async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/users/register', async (req, res) => {
  const { phone, name, address } = req.body;
  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const newUser = await User.create({ phone, name, address });
    res.json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to register user', error: err.message });
  }
});

// --- REVIEWS ---
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: 1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save review', error: err.message });
  }
});

// --- COUPONS ---
app.post('/api/coupons/verify', async (req, res) => {
  const { code } = req.body;
  try {
    const coupon = await Coupon.findOne({ code });
    if (coupon) {
      res.json({ success: true, coupon });
    } else {
      res.json({ success: false, message: 'Invalid coupon' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = app;
