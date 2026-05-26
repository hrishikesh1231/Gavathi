// routes/authRoutes.js

import express from "express";

import protect from "../middleware/authMiddleware.js";

import {

  signup,
  login,

  sendOTP,
  verifyOTP,

} from "../controllers/authController.js";

const router = express.Router();

// ======================================
// AUTH ROUTES
// ======================================

// SEND OTP
router.post(
  "/send-otp",
  sendOTP
);

// VERIFY OTP
router.post(
  "/verify-otp",
  verifyOTP
);

// SIGNUP
router.post(
  "/signup",
  signup
);

// LOGIN
router.post(
  "/login",
  login
);

// PROTECTED ROUTE
router.get(

  "/me",

  protect,

  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "Protected Route Accessed",

      user: req.user,

    });

  }

);

export default router;