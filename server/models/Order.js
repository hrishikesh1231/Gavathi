import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(

  {
    customerId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },
    customer: {

      name: String,

      address: String,

      taluka: String,

      district: String,

      pinCode: String,

      whatsappNumber: String,

      callingNumber: String,

    },

    products: [

      {

        productId: {

          type: mongoose.Schema.Types.ObjectId,

          ref: "Product",

        },

        name: String,

        image: String,

        price: Number,

        quantity: Number,

      },

    ],

    totalPrice: Number,

    status: {

      type: String,

      enum: [

        "Pending",

        "Seller Responded",

        "Confirmed",

        "Preparing",

        "Delivered",

        "Cancelled",

      ],

      default: "Pending",

    },

    seller: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },

    // =====================================
    // SELLER RESPONSE
    // =====================================

    sellerResponse: {

      type: Object,

      default: {},

    },

    // =====================================
    // BILLING
    // =====================================

    deliveryCharge: {

      type: Number,

      default: 0,

    },

    discount: {

      type: Number,

      default: 0,

    },

    finalTotal: {

      type: Number,

      default: 0,

    },

    // =====================================
    // DELIVERY
    // =====================================

    expectedDeliveryDate: {

      type: Date,

    },

    sellerMessage: {

      type: String,

      default: "",

    },

    // =====================================
    // CUSTOMER DECISION
    // =====================================

    customerDecision: {

      type: String,

      enum: [

        "Pending",

        "Confirmed",

        "Cancelled",

      ],

      default: "Pending",

    },

    // =====================================
    // PAYMENT
    // =====================================

    paymentMethod: {

      type: String,

      enum: [

        "COD",

        "ONLINE",

      ],

      default: "COD",

    },

  },

  {

    timestamps: true,

  }

);

export default mongoose.model(
  "Order",
  orderSchema
);