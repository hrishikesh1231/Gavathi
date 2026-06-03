import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(

  {

    // =====================================
    // CUSTOMER
    // =====================================

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

    // =====================================
    // PRODUCTS
    // =====================================

    products: [

      {

        productId: {

          type:
            mongoose.Schema.Types.ObjectId,

          ref: "Product",

        },

        name: String,

        image: String,

        price: Number,

        quantity: Number,

      },

    ],

    // =====================================
    // ORIGINAL TOTAL
    // =====================================

    totalPrice: {

      type: Number,

      default: 0,

    },

    // =====================================
    // SELLER
    // =====================================

    seller: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },

    // =====================================
    // ORDER STATUS
    // =====================================

    status: {

      type: String,

      enum: [

        "Pending",

        "Seller Responded",

        "Confirmed",

        "Cancelled",

      ],

      default: "Pending",

    },

    // =====================================
    // DELIVERY STATUS
    // =====================================

    deliveryStatus: {

      type: String,

      enum: [

        "Pending",

        "Preparing",

        "Out For Delivery",

        "Delivered",

      ],

      default: "Pending",

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
    // DELIVERY INFO
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

    // =====================================
    // TRACKING
    // =====================================

    deliveredAt: Date,

    confirmedAt: Date,

    sellerRespondedAt: Date,

  },

  {

    timestamps: true,

  }

);

export default mongoose.model(
  "Order",
  orderSchema
);