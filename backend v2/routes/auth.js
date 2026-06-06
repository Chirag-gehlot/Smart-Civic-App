import express from "express";
import { supabase } from "../services/supabaseClient.js";
import verifyToken from "../middleware/authmiddleware.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/tokenOperations.js";
import { authRefreshLimiter } from "../middleware/rateLimiters.js";
import dotenv from "dotenv";
dotenv.config();

const authRouter = express.Router();

authRouter.post("/refresh", authRefreshLimiter, async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  //No refresh token
  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token missing",
    });
  }

  let decoded;

  //Verify refresh token signature
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }

  const { uid: userId, name, jti } = decoded;

  //Validate refresh token in DB
  const { data: tokenRow, error } = await supabase
    .from("tokenRegistry")
    .select("*")
    .eq("jti", jti)
    .eq("status", "active")
    .maybeSingle();

  if (error || !tokenRow) {
    return res.status(401).json({
      success: false,
      message: "Refresh token revoked",
    });
  }

  // Rotate refresh token
  await supabase
    .from("tokenRegistry")
    .update({ status: "revoked" })
    .eq("jti", jti);

  const { refreshToken: newRefreshToken, jtid: newJti } = generateRefreshToken(
    userId,
    name,
  );

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await supabase.from("tokenRegistry").insert({
    uid: userId,
    jti: newJti,
    status: "active",
    expires_at: expiresAt,
  });

  // Issue new access token
  const newAccessToken = generateAccessToken(userId, name);

  // Send new refresh token cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Send new access token
  return res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});

authRouter.get("/me", verifyToken, (req, res) => {
  console.log("!!I have been hit!!");
  res.status(200).json({
    success: true,
    user: req.user, // ✅ return the full user object from the token
  });
});

export default authRouter;
