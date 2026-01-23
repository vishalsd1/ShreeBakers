import mongoose from "mongoose";

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

    cartItems: [
      {
        id: String,
        name: String,
        price: Number,
        weight: String,
        quantity: Number,
        type: String,
        itemTotal: Number,
      },
    ],

    total: Number,

    status: {
      type: String,
      default: "Confirmed",
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
