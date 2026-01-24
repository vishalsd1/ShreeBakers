import mongoose from "mongoose";
import Order from "../models/Order.js";

// ✅ Reuse Mongo connection (Vercel-safe)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  try {
    await connectDB();

    // -------- GET ALL ORDERS --------
    if (req.method === "GET") {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }

    // -------- CREATE ORDER --------
    if (req.method === "POST") {
      const { customerInfo, cartItems, total, expressDelivery } = req.body;

      if (
        !customerInfo ||
        !customerInfo.name ||
        !customerInfo.phone ||
        !customerInfo.address ||
        !Array.isArray(cartItems) ||
        cartItems.length === 0
      ) {
        return res.status(400).json({ message: "Invalid order data" });
      }

      const order = await Order.create({
        customerInfo,
        cartItems,
        total,
        expressDelivery: Boolean(expressDelivery),
        status: "Pending",
      });

      return res.status(201).json({
        message: "Order placed successfully",
        order,
      });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("ORDERS API CRASH:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
