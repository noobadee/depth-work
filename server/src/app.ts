import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./modules/auth/auth.ts";
import { env } from "./config/env.ts";
// import { passwordResetLimiter } from "./middleware/rate-limit.middleware.ts";

const app = express();

// ──── CORS ────────────────────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: env.WEB_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ──── BETTERAUTH HANDLER ────────────────────────────────────────────────────────────────────────────
// app.use("api/auth/forget-password", passwordResetLimiter);

// Bridges a web-standard request handler to Node.js http.IncomingMessage and http.ServerResponse objects.
app.all("/api/auth/*splat", toNodeHandler(auth));

// ──── BODY PARSING ────────────────────────────────────────────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ──── HEALTH CHECK ────────────────────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ──── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────────────────────────────

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error:
        env.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
  },
);

// For testing purposes (check if BetterAuth can see Google config)
// app.get("/debug/auth-config", (req, res) => {
//   res.json({
//     googleConfigured: !!(
//       env.GOOGLE_CLIENT_ID &&
//       env.GOOGLE_CLIENT_SECRET
//     ),
//     betterAuthUrl: env.BETTER_AUTH_URL,
//     frontendUrl: env.WEB_URL,
//   });
// });

// ──── START ────────────────────────────────────────────────────────────────────────────

app.listen(env.PORT, () =>
  console.log(`Server running on http://localhost:${env.PORT}`),
);

export default app;
