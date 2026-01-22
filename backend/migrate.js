const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Cake = require('./models/Cake');
const Order = require('./models/Order');
const User = require('./models/User');
const Message = require('./models/Message');
const Review = require('./models/Review');
const Coupon = require('./models/Coupon');

const DATA_DIR = path.join(__dirname, 'data');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();

  try {
    console.log('Reading JSON files...');
    // Helper to read JSON safely
    const readJSON = (file) => {
      const filePath = path.join(DATA_DIR, file);
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return data ? JSON.parse(data) : [];
      }
      return [];
    };

    const cakes = readJSON('cakes.json');
    const orders = readJSON('orders.json');
    const users = readJSON('users.json');
    const messages = readJSON('messages.json');
    const reviews = readJSON('reviews.json');
    const coupons = readJSON('coupons.json');

    console.log('Clearing existing database collections...');
    await Cake.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    await Message.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});

    console.log('Importing data...');
    
    if (cakes.length > 0) await Cake.insertMany(cakes);
    if (orders.length > 0) await Order.insertMany(orders);
    if (users.length > 0) await User.insertMany(users);
    if (messages.length > 0) await Message.insertMany(messages);
    if (reviews.length > 0) await Review.insertMany(reviews);
    if (coupons.length > 0) await Coupon.insertMany(coupons);

    console.log('Data Imported Successfully');
    process.exit();
  } catch (err) {
    console.error('Error importing data:', err);
    process.exit(1);
  }
};

importData();
