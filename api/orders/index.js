import connectDB from "../db.js";
import Order from "../models/Orders.js";

export default async function handler(req, res) {
  await connectDB();

  try {
    // POST /api/orders  (save new order)
    if (req.method === "POST") {
      const order = await Order.create(req.body);
      return res.status(201).json(order);
    }

    // GET /api/orders  (admin dashboard)
    if (req.method === "GET") {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.status(200).json(orders);
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Orders API error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
}
