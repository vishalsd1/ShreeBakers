import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      default: "contact",
      enum: ["contact", "order"],
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    meta: {
      type: Object,
      default: {},
    }
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
