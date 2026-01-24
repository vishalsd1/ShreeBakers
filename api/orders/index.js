import mongoose from "mongoose";
import Order from "../models/Order.js";

// 🔹 Mongo connection (Vercel-safe)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  try {
    // ✅ ALWAYS CONNECT FIRST
    await connectDB();

    // ---------------- GET ALL ORDERS ----------------
    if (req.method === "GET") {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }

    // ---------------- CREATE ORDER ----------------
    if (req.method === "POST") {
      const {
        customerInfo,
        cartItems,
        total,
        expressDelivery,
      } = req.body;

      // 🔴 VALIDATION (VERY IMPORTANT)
      if (
        !customerInfo ||
        !customerInfo.name ||
        !customerInfo.phone ||
        !customerInfo.address ||
        !Array.isArray(cartItems) ||
        cartItems.length === 0
      ) {
        return res.status(400).json({
          message: "Invalid order data",
        });
      }

      const order = await Order.create({
        customerInfo,
        cartItems,
        total,
        expressDelivery: !!expressDelivery,
        status: "Pending",
      });

      // ✅ THIS RESPONSE WAS MISSING IN YOUR CODE
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
    console.error("ORDERS API ERROR:", error);

    // ✅ ALWAYS RETURN RESPONSE (NO HANG)
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
