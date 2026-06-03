// routes/orderRoutes.js

import express from "express";

import {

  createOrder,

  getSellerOrders,

  respondToOrder,

  getCustomerOrders,

  customerResponse,

  updateDeliveryStatus,

} from "../controllers/orderController.js";

import protect from "../middleware/authMiddleware.js";

import validate from "../middleware/validateMiddleware.js";

import {

  createOrderSchema,

} from "../validations/orderValidation.js";

const router = express.Router();


// ========================================
// CREATE ORDER
// ========================================

router.post(

  "/create",

  protect,

  validate(createOrderSchema),

  createOrder

);


// ========================================
// GET SELLER ORDERS
// ========================================

router.get(

  "/seller-orders",

  protect,

  getSellerOrders

);


// ========================================
// GET CUSTOMER ORDERS
// ========================================

router.get(

  "/my-orders",

  protect,

  getCustomerOrders

);


// ========================================
// SELLER RESPONSE
// ========================================

router.put(

  "/respond/:id",

  protect,

  respondToOrder

);


// ========================================
// CUSTOMER RESPONSE
// ========================================

router.put(

  "/customer-response/:id",

  protect,

  customerResponse

);


// ========================================
// UPDATE DELIVERY STATUS
// ========================================

router.put(

  "/delivery-status/:id",

  protect,

  updateDeliveryStatus

);


export default router;