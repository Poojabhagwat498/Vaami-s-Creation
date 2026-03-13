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
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "Card",
    },

    paymentStatus: {
      type: String,
      default: "paid",
    },

    status: {
      type: String,
      default: "processing",
    },

    deliveryAddress: {
      name: String,
      phone: String,
      area: String,
      city: String,
      state: String,
      pincode: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);