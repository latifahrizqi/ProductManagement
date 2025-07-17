import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 1 menit
  max: 3, // atau 1 seperti kamu
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => req.ip,
  handler: (req, res, next) => {
    const retryAfterMs = req.rateLimit?.resetTime?.getTime()
      ? req.rateLimit.resetTime.getTime() - Date.now()
      : 60000; // fallback

    const resetTime = new Date(Date.now() + retryAfterMs);
    return res.status(429).json({
      msg: "Terlalu banyak percobaan login gagal. Coba lagi nanti.",
      resetTime: resetTime.toISOString(),
    });
  },
});
