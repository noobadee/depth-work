import postgres from "postgres";
import { env } from "../config/env.ts";

function getSSLConfig() {
  if (process.env.DB_SSL === "false") return false;
  if (process.env.DB_SSL === "no-verify")
    return {
      rejectUnauthorized: false,
    };

  if (env.NODE_ENV === "production") {
    return { rejectUnathorized: true };
  }

  // Development — try to detect from DATABASE_URL
  const url = env.DATABASE_URL;
  if (url.includes("sslmode=require")) {
    // Cloud DB in dev (Railway, Neon, Supabase, etc.)
    // rejectUnauthorized: false because dev DBs often use self-signed certs
    return { rejectUnauthorized: false };
  }

  // Local postgres with no SSL
  return false;
}

const connectionString = env.DATABASE_URL!;

export const migrationClient = postgres(connectionString, {
  max: 1,
  ssl: getSSLConfig(),
});

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl: getSSLConfig(),
});

export default client;
