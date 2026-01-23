import connectDB from "../db.js";
import Cake from "../models/Cakes.js";

export default async function handler(req, res) {
  await connectDB();

  try {
    // GET /api/cakes
    if (req.method === "GET") {
      const cakes = await Cake.find().sort({ createdAt: -1 });
      return res.status(200).json(cakes);
    }

    // POST /api/cakes
    if (req.method === "POST") {
      const cake = await Cake.create(req.body);
      return res.status(201).json(cake);
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Cakes API error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
}
