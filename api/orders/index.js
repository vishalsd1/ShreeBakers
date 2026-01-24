import mongoose from "mongoose";
import Order from "../models/Order.js";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI not defined");
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
}

export default async function handler(req, res) {
  try {
    await connectDB();

    // ✅ GET all orders
    if (req.method === "GET") {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }

    // ✅ CREATE order
    if (req.method === "POST") {
      const { customerInfo, cartItems, total, expressDelivery } = req.body;

      if (
        !customerInfo?.name ||
        !customerInfo?.phone ||
        !customerInfo?.address ||
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
        expressDelivery: Boolean(expressDelivery),
        status: "Confirmed",
        estimatedDeliveryTime: expressDelivery
          ? new Date(Date.now() + 25 * 60 * 1000)
          : null,
      });

      return res.status(201).json({
        message: "Order placed successfully",
        order,
      });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("❌ ORDERS API ERROR:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
