import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

    // MULTIPLE IMAGES
    images: [
    {
        type: String,
        required: true,
    },
    ],

  description: {
    type: String,
  },

  category: {
    type: String,
  },

    stock: {
    type: Number,
    required: true,
    min: 1,
    },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

}, {
  timestamps: true,
});

const Product = mongoose.model(
  "Product",
  productSchema
);

export default Product;