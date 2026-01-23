import connectDB from "../db.js";
import Order from "../models/Orders.js";

export default async function handler(req, res) {
  await connectDB();

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const orders = await Order.find({
      "customerInfo.phone": phone,
    }).sort({ createdAt: -1 });

    // Map _id -> id for frontend compatibility
    const formattedOrders = orders.map((order) => ({
      id: order._id,
      createdAt: order.createdAt,
      status: order.status,
      total: order.total,
      cartItems: order.cartItems,
    }));

    return res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Order tracking error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
}
