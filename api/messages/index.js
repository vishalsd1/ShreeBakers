import connectDB from "../db.js";
import Message from "../models/Message.js";

export default async function handler(req, res) {
  await connectDB();

  try {
    // POST /api/messages  (Contact form)
    if (req.method === "POST") {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const savedMessage = await Message.create({
        name,
        email,
        message,
      });

      return res.status(201).json(savedMessage);
    }

    // GET /api/messages  (Admin dashboard)
    if (req.method === "GET") {
      const messages = await Message.find().sort({ createdAt: -1 });
      return res.status(200).json(messages);
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Messages API error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
}
