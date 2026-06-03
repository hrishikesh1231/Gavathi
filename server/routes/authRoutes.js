// routes/authRoutes.js

import express from "express";

import protect from "../middleware/authMiddleware.js";

import validate from "../middleware/validateMiddleware.js";

import {

  signup,
  login,

  sendOTP,
  verifyOTP,

} from "../controllers/authController.js";

import {

  signupSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,

} from "../validations/authValidation.js";

const router = express.Router();

// ======================================
// AUTH ROUTES
// ======================================

// SEND OTP
router.post(

  "/send-otp",

  validate(sendOtpSchema),

  sendOTP

);

// VERIFY OTP
router.post(

  "/verify-otp",

  validate(verifyOtpSchema),

  verifyOTP

);

// SIGNUP
router.post(

  "/signup",

  validate(signupSchema),

  signup

);

// LOGIN
router.post(

  "/login",

  validate(loginSchema),

  login

);

// ======================================
// PROTECTED ROUTE
// ======================================

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