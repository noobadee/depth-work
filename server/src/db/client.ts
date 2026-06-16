import "dotenv/config";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

export const migrationClient = postgres(connectionString, { max: 1 });

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: true }
      : false,
});

export default client;
