import mongoose from "mongoose";
import Order from "../models/Orders.js";

// User Schema (consolidated to keep function count low)
const UserSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    name: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

// Review Schema (consolidated here to save serverless functions)
const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

// Coupon Schema (consolidated here)
const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discount: { type: Number, required: true },
    minOrder: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 500 },
    active: { type: Boolean, default: true },
    expiryDate: { type: Date },
  },
  { timestamps: true }
);

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);

// ✅ USE CORRECT ENV NAME
const MONGO_URI = process.env.MONGO_URI;
const SERVICE_CENTER_LAT = parseFloat(process.env.SERVICE_CENTER_LAT || "20.089541");
const SERVICE_CENTER_LNG = parseFloat(process.env.SERVICE_CENTER_LNG || "75.422227");
const SERVICE_RADIUS_KM = parseFloat(process.env.SERVICE_RADIUS_KM || "10");

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is not defined in environment variables");
}

// ✅ Simple, stable Mongo connection (Vercel-safe)
async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  await mongoose.connect(MONGO_URI);
}

// Haversine distance in km
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default async function handler(req, res) {
  try {
    await connectDB();

    const url = new URL(req.url, `http://${req.headers.host}`);
    const action = url.searchParams.get("action");
    const includeAllReviews = url.searchParams.get("all") === "true";

    // USER REGISTER
    if (action === "register-user" && req.method === "POST") {
      const { phone, name, address } = req.body;
      if (!phone || phone.length !== 10 || !name || !address) {
        return res.status(400).json({ success: false, message: "Missing or invalid fields" });
      }

      const existing = await User.findOne({ phone });
      if (existing) {
        return res.status(409).json({ success: false, message: "User already exists" });
      }

      const user = await User.create({ phone, name, address });
      return res.status(201).json({ success: true, user });
    }

    // USER LOGIN
    if (action === "login-user" && req.method === "POST") {
      const { phone } = req.body;
      if (!phone || phone.length !== 10) {
        return res.status(400).json({ success: false, message: "Invalid phone" });
      }

      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({ success: true, user });
    }

    // REVIEWS ENDPOINTS (use action=reviews)
    if (action === "reviews") {
      if (req.method === "GET") {
        const filter = includeAllReviews ? {} : { approved: true };
        const reviews = await Review.find(filter).sort({ createdAt: -1 });
        return res.status(200).json(reviews);
      }
      
      if (req.method === "POST") {
        const { name, rating, comment } = req.body;
        if (!name || !rating || !comment) {
          return res.status(400).json({ message: "Missing review fields" });
        }
        const review = await Review.create({ name, rating, comment, approved: false });
        return res.status(201).json({ message: "Review submitted!", review });
      }
    }

    // APPROVE / REJECT REVIEW (use action=approve-review)
    if (action === "approve-review" && req.method === "POST") {
      const { id, approved } = req.body;
      const review = await Review.findByIdAndUpdate(id, { approved: Boolean(approved) }, { new: true });
      return res.status(200).json(review);
    }

    // DELETE REVIEW (use action=delete-review)
    if (action === "delete-review" && req.method === "POST") {
      const { id } = req.body;
      await Review.findByIdAndDelete(id);
      return res.status(204).end();
    }
    
    // COUPON VALIDATION (use action=validate-coupon)
    if (action === "validate-coupon" && req.method === "POST") {
      const { code, total } = req.body;
      const coupon = await Coupon.findOne({ code: code?.toUpperCase() });
      
      if (!coupon || !coupon.active) {
        return res.status(404).json({ message: "Invalid coupon" });
      }
      
      if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
        return res.status(400).json({ message: "Coupon expired" });
      }
      
      if (total < coupon.minOrder) {
        return res.status(400).json({ message: `Min order: ₹${coupon.minOrder}` });
      }
      
      const discountAmount = Math.min((total * coupon.discount) / 100, coupon.maxDiscount);
      return res.status(200).json({
        valid: true,
        discount: coupon.discount,
        discountAmount: Math.round(discountAmount),
        newTotal: Math.round(total - discountAmount),
      });
    }
    
    // UPDATE ORDER STATUS (use action=update-status)
    if (action === "update-status" && req.method === "POST") {
      const { id, status } = req.body;
      const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
      return res.status(200).json(order);
    }

    // TRACK ORDERS BY PHONE (use action=track)
    if (action === "track" && req.method === "POST") {
      const { phone } = req.body;
      const orders = await Order.find({ "customerInfo.phone": phone }).sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }

    // ---------------- GET ALL ORDERS ----------------
    if (req.method === "GET") {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }

    // ---------------- CREATE ORDER ----------------
    if (req.method === "POST") {
      const { customerInfo, cartItems, total, expressDelivery, discount, couponCode, paymentMethod, location } = req.body;

      if (
        !customerInfo?.name ||
        !customerInfo?.phone ||
        !customerInfo?.address ||
        !Array.isArray(cartItems) ||
        cartItems.length === 0 ||
        !location?.lat ||
        !location?.lng
      ) {
        return res.status(400).json({
          message: "Invalid order data",
        });
      }

      // Geofence validation
      const distanceKm = haversineDistance(
        SERVICE_CENTER_LAT,
        SERVICE_CENTER_LNG,
        Number(location.lat),
        Number(location.lng)
      );

      if (distanceKm > SERVICE_RADIUS_KM) {
        return res.status(400).json({
          message: `Sorry, delivery is only available within ${SERVICE_RADIUS_KM} km of Phulambri. Your location is ~${distanceKm.toFixed(1)} km away.`,
        });
      }

      const order = await Order.create({
        customerInfo,
        cartItems,
        total,
        discount: discount || 0,
        couponCode: couponCode ? couponCode.toUpperCase() : null,
        paymentMethod: paymentMethod || "Cash on Delivery",
        location: {
          lat: Number(location.lat),
          lng: Number(location.lng),
        },
        expressDelivery: Boolean(expressDelivery),
        status: "Confirmed",
        estimatedDeliveryTime: expressDelivery
          ? new Date(Date.now() + 25 * 60 * 1000)
          : null,
      });

      // ✅ VERY IMPORTANT: ALWAYS RETURN RESPONSE
      return res.status(201).json({
        message: "Order placed successfully",
        order,
      });
    }

    // ---------------- METHOD NOT ALLOWED ----------------
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  } catch (error) {
    console.error("❌ ORDERS API ERROR:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
