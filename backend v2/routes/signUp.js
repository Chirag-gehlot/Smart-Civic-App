import express from "express";
import { Client } from "../services/twilioClient.js";
import { supabase } from "../services/supabaseClient.js";
import { sendOtp, verifyOtp } from "../utils/manageOtp.js";
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
  signupSendOtpSchema,
  signupVerifyOtpSchema,
} from "../validation/schemas.js";

const signupRouter = express.Router();

// Send OTP route — no changes needed here
signupRouter.post(
  "/send-otp",
  validateRequest(signupSendOtpSchema),
  otpSendLimiter,
  async (req, res) => {
    const { full_name, phone_number } = req.body;

    try {
      const { data: existingUser, error: selectError } = await supabase
        .from("users")
        .select("*")
        .eq("phone_number", phone_number)
        .maybeSingle();

      if (selectError) console.error("Supabase select error:", selectError);

      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      const { error: upsertError } = await supabase
        .from("pending_signups")
        .upsert({ full_name, phone_number }, { onConflict: "phone_number" });

      if (upsertError) {
        return res
          .status(500)
          .json({ success: false, message: upsertError.message });
      }

      const otpRes = await sendOtp(Client, phone_number);
      if (!otpRes.success) {
        return res
          .status(500)
          .json({ success: false, message: otpRes.message });
      }

      res
        .status(200)
        .json({ success: true, message: "OTP sent successfully!" });
    } catch (err) {
      console.error("send-otp error:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
);

// Verify OTP route — now uses the same token system as login
signupRouter.post(
  "/verify-otp",
  validateRequest(signupVerifyOtpSchema),
  otpVerifyLimiter,
  async (req, res) => {
    const { phone_number, code } = req.body;

    try {
      const otpRes = await verifyOtp(Client, phone_number, code);
      if (!otpRes.success) {
        return res
          .status(400)
          .json({ success: false, message: otpRes.message });
      }

      const { data: pendingData, error: pendingError } = await supabase
        .from("pending_signups")
        .select("*")
        .eq("phone_number", phone_number)
        .single();

      if (pendingError || !pendingData) {
        return res
          .status(400)
          .json({ success: false, message: "No signup request found" });
      }

      const { full_name } = pendingData;

      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([{ full_name, phone_number }])
        .select();

      if (insertError) {
        return res
          .status(500)
          .json({ success: false, message: insertError.message });
      }

      await supabase
        .from("pending_signups")
        .delete()
        .eq("phone_number", phone_number);

      // ✅ Now uses the same token system as login
      const accessToken = generateAccessToken(newUser[0].id, full_name);
      const { refreshToken, jtid } = generateRefreshToken(
        newUser[0].id,
        full_name,
      );

      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const { error: tokenError } = await supabase.from("tokenRegistry").insert({
        uid: newUser[0].id,
        jti: jtid,
        status: "active",
        expires_at: expiresAt,
      });

      if (tokenError) {
        return res.status(500).json({
          success: false,
          message: "Failed to store refresh token",
        });
      }

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        success: true,
        message: "Signup successful!",
        accessToken,
        user: newUser[0],
      });
    } catch (err) {
      console.error("verify-otp error:", err);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
);

export default signupRouter;
