import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.ts";
import * as schema from "../db/schema/index.ts";
import { randomUUID } from "crypto";
import nodemailer from "nodemailer";
import { env } from "../config/env.ts";

// ──── EMAIL TRANSPORTER ────────────────────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: env.SMTP_SECURE === "true",
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

// ──── BETTERAUTH ────────────────────────────────────────────────────────────────────────────
export const auth = betterAuth({
  // ──── Identity ────────────────────────────────────────────────────────────────────────────
  appName: "DepthWork",
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,

  // ──── Database adapter ────────────────────────────────────────────────────────────────────────────
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  // ──── ID generation ────────────────────────────────────────────────────────────────────────────
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh session after 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // cache session in cookie for 5
    },
  },

  // ──── Cookie config ────────────────────────────────────────────────────────────────────────────
  advanced: {
    generateId: () => randomUUID(),
    crossSubdomainCookies: {
      enabled: false,
    },
    defaultCookieAttributes: {
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      partitioned: env.NODE_ENV === "production",
    },
  },

  // ──── Email / Password ────────────────────────────────────────────────────────────────────────────
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,

    sendResetPassword: async ({ user, url }) => {
      await transporter.sendMail({
        from: `"DepthWork" <${env.SMTP_FROM}>`,
        to: user.email,
        subject: "Reset your password",
        html: `
          <p>Hi ${user.name},</p>
          <p>Click the link below to reset your password. It expires in 1 hour.</p>
          <a href="${url}">${url}</a>
          <p>If you didn't request this, ignore this email.</p>
        `,
      });
    },
  },

  // ──── Email verification ────────────────────────────────────────────────────────────────────────────
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24, // verification link valid for 24 hours
    sendVerificationEmail: async ({ user, url }) => {
      await transporter.sendMail({
        from: `"DepthWork" <${env.SMTP_FROM}>`,
        to: user.email,
        subject: "Verifiy your email",
        html: `
          <p>Hi ${user.name},</p>
          <p>Click the link below to verify your email address.</p>
          <a href="${url}">${url}</a>
          <p>This link expires in 24 hours.</p>
        `,
      });
    },
  },

  // ──── Google OAuth ────────────────────────────────────────────────────────────────────────────
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
      redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
  },

  // ──── Trusted origins (CORS) ────────────────────────────────────────────────────────────────────────────
  trustedOrigins: [env.WEB_URL!],
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
