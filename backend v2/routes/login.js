import express from "express";
import { supabase } from "../services/supabaseClient.js";
import { sendOtp, verifyOtp } from "../utils/manageOtp.js";
import { Client } from "../services/twilioClient.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/tokenOperations.js";
import validateRequest from "../middleware/validateRequest.js";
import {
  otpSendLimiter,
  otpVerifyLimiter,
} from "../middleware/rateLimiters.js";
import {
  loginSendOtpSchema,
  loginVerifyOtpSchema,
} from "../validation/schemas.js";

const loginRouter = express.Router();

loginRouter.post(
  "/send-otp",
  validateRequest(loginSendOtpSchema),
  otpSendLimiter,
  async (req, res) => {
    const { phone_number } = req.body;

    // Check if user exists
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("phone_number", phone_number)
      .maybeSingle();

    if (error) {
      console.error("Supabase error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Database error, please try again" });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist. Please sign up first.",
      });
    }

    // Send OTP using Twilio
    try {
      const otpRes = await sendOtp(Client, phone_number);

      if (!otpRes.success) {
        return res
          .status(500)
          .json({ success: false, message: otpRes.message });
      }

      return res.status(200).json({
        success: true,
        message: `OTP sent successfully to ${phone_number}`,
      });
    } catch (twilioError) {
      console.error("Twilio sendOtp error:", twilioError);
      return res
        .status(500)
        .json({ success: false, message: twilioError.message });
    }
  },
);

loginRouter.post(
  "/verify-otp",
  validateRequest(loginVerifyOtpSchema),
  otpVerifyLimiter,
  async (req, res) => {
    const { phone_number, code } = req.body;

    try {
      // Verify OTP via Twilio
      const otpRes = await verifyOtp(Client, phone_number, code);
      if (!otpRes.success) {
        return res
          .status(400)
          .json({ success: false, message: otpRes.message });
      }

      // Fetch user details
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("phone_number", phone_number)
        .maybeSingle();

      if (error) {
        console.error("Supabase select error:", error);
        return res
          .status(500)
          .json({ success: false, message: "Database error" });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found. Please sign up first.",
        });
      }

      const accessToken = generateAccessToken(user.id, user.full_name);
      const { refreshToken, jtid } = generateRefreshToken(
        user.id,
        user.full_name, // ✅ passing name so it's stored in refresh token payload
      );

      const sevenDaysLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const { error: insertError } = await supabase
        .from("tokenRegistry")
        .insert({
          uid: user.id,
          jti: jtid,
          status: "active",
          expires_at: sevenDaysLater,
        });

      if (insertError) {
        // ✅ was "err" which is always undefined — Supabase returns "error"
        return res.status(500).json({
          success: false,
          message: "Failed to store refresh token",
          error: insertError,
        });
      }

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax", // ✅ was "strict" which blocks cross-origin cookies
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        accessToken: accessToken,
        user: user,
      });
    } catch (err) {
      console.error("verify-otp error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
);

export default loginRouter;
