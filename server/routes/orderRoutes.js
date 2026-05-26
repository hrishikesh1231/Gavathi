import express from "express";

import {
  createOrder,
  getSellerOrders,
  respondToOrder,
  getCustomerOrders,
   customerResponse,
} from "../controllers/orderController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// =========================
// CREATE ORDER
// =========================

router.post(
  "/create",
  protect,
  createOrder
);


// =========================
// GET SELLER ORDERS
// =========================

router.get(
  "/seller-orders",
  protect,
  getSellerOrders
);


// =========================
// GET CUSTOMER ORDERS
// =========================

router.get(
  "/my-orders",
  protect,
  getCustomerOrders
);


// =========================
// SELLER RESPONSE
// =========================

router.put(
  "/respond/:id",
  protect,
  respondToOrder
);

router.put(
  "/customer-response/:id",
  protect,
  customerResponse
);

export default router;