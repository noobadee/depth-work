// import rateLimit from "express-rate-limit";
// import { PostgresStore } from "@acpr/rate-limit-postgresql";
// import { env } from "../config/env.ts";

// // ─── SHARED STORE CONFIG ──────────────────────────────────────────────────────
// // Reuse your existing DB connection
// const storeConfig = {
//   conString: env.DATABASE_URL,
//   tableName: "rate_limit",
//   createTableIfMissing: true,
// };

// // ─── PASSWORD RESET LIMITER ───────────────────────────────────────────────────
// // Extra tight — prevents email spam and user enumeration at scale
// export const passwordResetLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000,          // 1 hour
//   max: 5,                             // 5 reset attempts per hour per IP
//   standardHeaders: "draft-7",
//   legacyHeaders: false,
//   store: new PostgresStore(storeConfig, "password-reset-limit"),
//   message: {
//     error: "Too many password reset attempts. Try again in 1 hour.",
//     code: "RESET_RATE_LIMIT_EXCEEDED",
//   },
// });