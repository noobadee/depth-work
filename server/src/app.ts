export default createApp;

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { toNodeHandler } from "better-auth/node";
import {
  createErrorHandler,
  notFoundHandler,
} from "@/common/middleware/errorHandler.ts";
import { env } from "@/config/env.ts";
import { auth } from "@/modules/auth/auth.ts";
import { workspacesRouter } from "@/modules/workspaces/router.ts";
import { workspaceMembersRouter } from "@/modules/workspace-members/router.ts";
import { projectsRouter } from "@/modules/projects/router.ts";
import { projectMembersRouter } from "@/modules/project-members/router.ts";
import { focusSessionsRouter } from "@/modules/focus-sessions/router.ts";
// import { passwordResetLimiter } from "./middleware/rate-limit.middleware.ts";

function createApp() {
  const app = express();

  // ──── CORS ────────────────────────────────────────────────────────────────────────────

  app.use(
    cors({
      origin: env.WEB_URL,
      credentials: true,
    }),
  );

  // ──── HTTP REQUEST LOGGER ────────────────────────────────────────────────────────────────────────────

  app.use(morgan("dev"));

  // ──── BETTERAUTH HANDLER ────────────────────────────────────────────────────────────────────────────
  // app.use("api/auth/forget-password", passwordResetLimiter);
  // Bridges a web-standard request handler to Node.js http.IncomingMessage and http.ServerResponse objects.
  app.all("/api/auth/*splat", toNodeHandler(auth));

  // ──── BODY PARSING ────────────────────────────────────────────────────────────────────────────

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ──── HEALTH CHECK ────────────────────────────────────────────────────────────────────────────

  app.get("/health", (_req, res) => {
    res.json({
      success: true,
      data: { confirmed_at: new Date().toISOString() },
    });
  });

  // ──── FEATURE ROUTES ────────────────────────────────────────────────────────────────────────────

  app.use("/api/workspaces", workspacesRouter);
  app.use("/api/workspaces/:workspace_id/members", workspaceMembersRouter);
  app.use("/api", projectsRouter);
  app.use("/api/projects", projectMembersRouter);
  app.use("/api/focus-sessions", focusSessionsRouter);

  // ──── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────────────────────────────

  app.use(notFoundHandler);
  app.use(createErrorHandler());

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

  return app;
}
