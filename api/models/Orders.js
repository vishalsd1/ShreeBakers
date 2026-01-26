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
