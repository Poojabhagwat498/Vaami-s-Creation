import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        _id: String,
        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: Number,
    paymentMethod: String,
    paymentStatus: {
      type: String,
      default: "paid",
    },
    status: {
      type: String,
      default: "Processing",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
