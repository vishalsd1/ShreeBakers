import connectDB from "../db.js";
import Cake from "../models/Cakes.js";

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  try {
    if (req.method === "DELETE") {
      await Cake.findByIdAndDelete(id);
      return res.status(200).json({ message: "Cake deleted successfully" });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Delete cake error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
}
