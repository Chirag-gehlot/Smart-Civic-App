import { ipKeyGenerator, rateLimit } from "express-rate-limit";

const tooManyRequestsResponse = {
  success: false,
  message: "Too many requests. Please try again later.",
};

const baseLimiterOptions = {
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json(tooManyRequestsResponse),
};

const getIpKey = (req) => ipKeyGenerator(req.ip);

const getPhoneIpKey = (req) =>
  `${getIpKey(req)}:${req.body?.phone_number ?? "unknown-phone"}`;

// Uses the in-memory store for now. Replace with a Redis-backed store before
// running multiple backend instances so limits are shared across all servers.
export const globalLimiter = rateLimit({
  ...baseLimiterOptions,
  windowMs: 15 * 60 * 1000,
  limit: 300,
});

export const chatQueryLimiter = rateLimit({
  ...baseLimiterOptions,
  windowMs: 60 * 1000,
  limit: 20,
  keyGenerator: (req) =>
    req.user?.uid ? `user:${req.user.uid}` : `ip:${getIpKey(req)}`,
});

export const otpSendLimiter = rateLimit({
  ...baseLimiterOptions,
  windowMs: 15 * 60 * 1000,
  limit: 3,
  keyGenerator: getPhoneIpKey,
});

export const otpVerifyLimiter = rateLimit({
  ...baseLimiterOptions,
  windowMs: 10 * 60 * 1000,
  limit: 5,
  keyGenerator: getPhoneIpKey,
});

export const authRefreshLimiter = rateLimit({
  ...baseLimiterOptions,
  windowMs: 15 * 60 * 1000,
  limit: 30,
});
