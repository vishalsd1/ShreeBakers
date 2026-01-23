import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    cakeId: { type: mongoose.Schema.Types.ObjectId, ref: "Cake" },
    name: { type: String, required: true },
    weight: { type: String, required: true }, // "0.5kg", "1kg"
    type: { type: String, required: true },   // Egg / Eggless
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },  // price per unit
    itemTotal: { type: Number, required: true }
  },
  { _id: false }
);

const CustomerInfoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    deliveryDate: { type: String },
    deliveryTime: { type: String },
    customMessage: { type: String }
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    customerInfo: {
      type: CustomerInfoSchema,
      required: true
    },

    cartItems: {
      type: [CartItemSchema],
      required: true
    },

    total: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["Confirmed", "Preparing", "Delivered"],
      default: "Confirmed"
    }
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
