// server.js

import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// ROUTES
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// ======================================
// TRUST PROXY (IMPORTANT FOR RENDER)
// ======================================

app.set("trust proxy", 1);

// ======================================
// SECURITY
// ======================================

// HELMET SECURITY
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// CORS SECURITY
app.use(
  cors({
    origin: [
      // process.env.CLIENT_URL,
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// ======================================
// BODY PARSER
// ======================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ======================================
// RATE LIMITERS
// ======================================

// OTP LIMITER
const otpLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 5,

  message: {

    success: false,

    message:
      "Too many OTP requests. Please try again later.",

  },

});

// LOGIN LIMITER
const loginLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 10,

  message: {

    success: false,

    message:
      "Too many login attempts. Try again later.",

  },

});

// GLOBAL API LIMITER
const apiLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 200,

  message: {

    success: false,

    message:
      "Too many requests from this IP",

  },

});

// APPLY GLOBAL LIMITER
app.use(apiLimiter);

// APPLY OTP LIMITER
app.use(
  "/api/v1/auth/send-otp",
  otpLimiter
);

// APPLY LOGIN LIMITER
app.use(
  "/api/v1/auth/login",
  loginLimiter
);

// ======================================
// ROOT ROUTE
// ======================================

app.get("/", (req, res) => {

  res.send(
    "GAVATHI API Running 🚀"
  );

});

// ======================================
// HEALTH CHECK ROUTE
// ======================================

app.get("/health", (req, res) => {

  res.status(200).json({

    success: true,

    message:
      "Server healthy ✅",

  });

});

// ======================================
// API ROUTES
// ======================================

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/v1/auth",
  authRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

// ======================================
// 404 HANDLER
// ======================================

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message:
      "API Route Not Found",

  });

});

// ======================================
// MONGODB CONNECTION
// ======================================

mongoose.connect(
  process.env.MONGO_URI
)

.then(() => {

  console.log(
    "MongoDB Connected ✅"
  );

  // ======================================
  // SERVER START
  // ======================================

  const PORT =
    process.env.PORT || 5000;

  app.listen(PORT, () => {

    console.log(
      `Server running on port ${PORT} 🚀`
    );

  });

})

.catch((err) => {

  console.log(
    "MongoDB Error:",
    err.message
  );

  process.exit(1);

});