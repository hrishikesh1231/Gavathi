import express from "express";

import {

  addProduct,

  getMyProducts,

  getAllProducts,

  deleteProduct,

  updateProduct,

  getSingleProduct,

} from "../controllers/productController.js";

import authMiddleware
from "../middleware/authMiddleware.js";

import upload
from "../middleware/upload.js";

const router =
  express.Router();

// ======================================
// GET ALL PRODUCTS
// PUBLIC ROUTE
// ======================================

router.get(

  "/",

  getAllProducts

);

// ======================================
// ADD PRODUCT
// PRIVATE SELLER ROUTE
// ======================================

router.post(

  "/add-product",

  authMiddleware,

  // MULTIPLE IMAGE UPLOAD
  upload.array(
    "images",
    5
  ),

  addProduct

);

// ======================================
// GET LOGGED IN SELLER PRODUCTS
// PRIVATE SELLER ROUTE
// ======================================

router.get(

  "/my-products",

  authMiddleware,

  getMyProducts

);

// ======================================
// GET SINGLE PRODUCT
// PUBLIC ROUTE
// ======================================

router.get(

  "/:id",

  getSingleProduct

);

// ======================================
// UPDATE PRODUCT
// PRIVATE SELLER ROUTE
// ======================================

router.put(

  "/update-product/:id",

  authMiddleware,

  // MULTIPLE IMAGE UPDATE
  upload.array(
    "images",
    5
  ),

  updateProduct

);

// ======================================
// DELETE PRODUCT
// PRIVATE SELLER ROUTE
// ======================================

router.delete(

  "/delete-product/:id",

  authMiddleware,

  deleteProduct

);

export default router;