import mongoose from "mongoose";

const WeightSchema = new mongoose.Schema(
  {
    size: { type: String, required: true }, // "0.5kg", "1kg"
    price: { type: Number, required: true },
  },
  { _id: false }
);

const CakeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    type: {
      type: String,
      enum: ["Egg", "Eggless"],
      required: true,
    },
    image: { type: String, required: true }, // base64 or URL
    bestseller: { type: Boolean, default: false },

    // Admin shows this, frontend uses weights
    price: { type: Number, required: true },

    weights: {
      type: [WeightSchema],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Cake ||
  mongoose.model("Cake", CakeSchema);
