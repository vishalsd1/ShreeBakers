import mongoose from "mongoose";

// Define cart item schema separately
const CartItemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    weight: { type: String, required: true },
    quantity: { type: Number, required: true },
    type: { type: String, required: true },
    itemTotal: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    customerInfo: {
      name: String,
      phone: String,
      address: String,
      deliveryDate: String,
      deliveryTime: String,
      customMessage: String,
    },

    cartItems: [CartItemSchema],

    total: Number,

    discount: {
      type: Number,
      default: 0,
    },

    couponCode: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      default: "Confirmed",
    },

    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },

    // 🚀 EXPRESS DELIVERY
    expressDelivery: {
      type: Boolean,
      default: false,
    },

    estimatedDeliveryTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
