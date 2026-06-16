import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce
    .number()
    .int()
    .min(1, "Server port is required")
    .max(65535, "Server port cannot exceed 65,535")
    .default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z
    .string()
    .min(1, "Database URL is required")
    .regex(
      /^(postgresql|postgres|mysql|mongodb|mongodb\+srv|redis|sqlite):\/\//,
      "Invalid database connection string protocol",
    ),
  BETTER_AUTH_SECRET: z.string().min(1, "BetterAuth Secret is required"),
  BETTER_AUTH_URL: z.string().min(1, "BetterAuth URL is required"),
  GOOGLE_CLIENT_ID: z.string().min(1, "Google Client ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "Google Client Secret is required"),
  WEB_URL: z.string().min(1, "Web URL is required"),
  SMTP_HOST: z.string().min(1, "SMTP host is required"),
  SMTP_PORT: z.coerce
    .number()
    .int()
    .min(1, "SMTP port is required")
    .max(65535, "SMTP port cannot exceed 65,535"),
  SMTP_USER: z.string().min(1, "SMTP username is required"),
  SMTP_PASS: z.string().min(1, "SMTP password is required"),
  SMTP_SECURE: z
    .string()
    .min(1, "SMTP secure state is required")
    .default("false"),
  SMTP_FROM: z.string().min(1, "SMTP email from is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
