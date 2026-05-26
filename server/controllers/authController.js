// controllers/authController.js

import User from "../models/User.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

// ======================================
// SEND OTP
// ======================================

export const sendOTP = async (
  req,
  res
) => {

  try {

    // SANITIZE EMAIL
    const email =
      req.body.email
        .trim()
        .toLowerCase();

    // CHECK EXISTING USER
    const existingUser =
      await User.findOne({ email });

    // CHECK VERIFIED USER
    if (
      existingUser &&
      existingUser.isVerified &&
      existingUser.password
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Email already registered",

      });

    }

    // OTP COOLDOWN
    if (

      existingUser?.otpExpiry &&

      existingUser.otpExpiry >
      new Date(Date.now() + 4 * 60 * 1000)

    ) {

      return res.status(400).json({

        success: false,

        message:
          "Please wait before requesting another OTP",

      });

    }

    // GENERATE OTP
    const otp = Math.floor(

      100000 +
      Math.random() * 900000

    ).toString();

    // OTP EXPIRY
    const otpExpiry = new Date(

      Date.now() +
      5 * 60 * 1000

    );

    // SAVE TEMP USER
    await User.findOneAndUpdate(

      { email },

      {

        email,
        otp,
        otpExpiry,

      },

      {

        upsert: true,
        new: true,

      }

    );

    // SEND EMAIL
    await resend.emails.send({

      from:
        process.env.EMAIL_FROM,

      to: email,

      subject:
        "Verify Your GAVATHI Account",

      html: `

        <div
          style="
            font-family:sans-serif;
            padding:20px;
          "
        >

          <h2>
            GAVATHI Email Verification
          </h2>

          <p>
            Your OTP is:
          </p>

          <h1
            style="
              letter-spacing:5px;
              color:#16a34a;
            "
          >
            ${otp}
          </h1>

          <p>
            OTP expires in 5 minutes.
          </p>

        </div>

      `,

    });

    console.log(
      `OTP sent to ${email}`
    );

    res.status(200).json({

      success: true,

      message:
        "OTP sent successfully",

    });

  } catch (error) {

    console.error(
      "Send OTP Error:",
      error.message
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to send OTP",

    });

  }

};

// ======================================
// VERIFY OTP
// ======================================

export const verifyOTP = async (
  req,
  res
) => {

  try {

    // SANITIZE DATA
    const email =
      req.body.email
        .trim()
        .toLowerCase();

    const otp =
      req.body.otp
        .trim();

    // FIND USER
    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "User not found",

      });

    }

    // CHECK OTP
    if (
      user.otp !== otp.toString()
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid OTP",

      });

    }

    // CHECK OTP EXPIRY
    if (
      user.otpExpiry <
      new Date()
    ) {

      return res.status(400).json({

        success: false,

        message:
          "OTP expired",

      });

    }

    // VERIFY USER
    await User.findOneAndUpdate(

      { email },

      {

        isVerified: true,

        otp: null,

        otpExpiry: null,

      }

    );

    res.status(200).json({

      success: true,

      message:
        "Email verified successfully",

    });

  } catch (error) {

    console.error(
      "Verify OTP Error:",
      error.message
    );

    res.status(500).json({

      success: false,

      message:
        "Verification failed",

    });

  }

};

// ======================================
// SIGNUP CONTROLLER
// ======================================

export const signup = async (
  req,
  res
) => {

  try {

    // SANITIZE DATA
    const name =
      req.body.name.trim();

    const email =
      req.body.email
        .trim()
        .toLowerCase();

    const password =
      req.body.password;

    // NAME VALIDATION
    if (name.length < 3) {

      return res.status(400).json({

        success: false,

        message:
          "Name must be at least 3 characters",

      });

    }

    // PASSWORD VALIDATION
    if (
      password.length < 6
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Password must be at least 6 characters",

      });

    }

    // FIND USER
    const existingUser =
      await User.findOne({ email });

    // CHECK VERIFIED
    if (
      !existingUser ||
      !existingUser.isVerified
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Please verify email first",

      });

    }

    // CHECK ACCOUNT
    if (
      existingUser.password
    ) {

      return res.status(400).json({

        success: false,

        message:
          "User already exists",

      });

    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // UPDATE USER
    existingUser.name = name;

    existingUser.password =
      hashedPassword;

    existingUser.role = "user";

    await existingUser.save();

    // GENERATE JWT
    const token = jwt.sign(

      {

        id: existingUser._id,

        name:
          existingUser.name,

        email:
          existingUser.email,

        role:
          existingUser.role,

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "7d",

      }

    );

    // RESPONSE
    res.status(201).json({

      success: true,

      message:
        "Account Created Successfully",

      token,

      user: {

        id:
          existingUser._id,

        name:
          existingUser.name,

        email:
          existingUser.email,

        role:
          existingUser.role,

      },

    });

  } catch (error) {

    console.error(
      "Signup Error:",
      error.message
    );

    res.status(500).json({

      success: false,

      message:
        "Server Error",

    });

  }

};

// ======================================
// LOGIN CONTROLLER
// ======================================

export const login = async (
  req,
  res
) => {

  try {

    // SANITIZE DATA
    const email =
      req.body.email
        .trim()
        .toLowerCase();

    const password =
      req.body.password;

    // FIND USER
    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid email or password",

      });

    }

    // CHECK VERIFIED
    if (!user.isVerified) {

      return res.status(400).json({

        success: false,

        message:
          "Please verify email first",

      });

    }

    // CHECK PASSWORD
    const isMatch =
      await bcrypt.compare(

        password,

        user.password

      );

    if (!isMatch) {

      return res.status(400).json({

        success: false,

        message:
          "Invalid email or password",

      });

    }

    // GENERATE TOKEN
    const token = jwt.sign(

      {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "7d",

      }

    );

    // RESPONSE
    res.status(200).json({

      success: true,

      message:
        "Login Successful",

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

      },

    });

  } catch (error) {

    console.error(
      "Login Error:",
      error.message
    );

    res.status(500).json({

      success: false,

      message:
        "Server Error",

    });

  }

};