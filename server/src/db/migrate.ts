import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { migrationClient } from "./client.ts";

const db = drizzle(migrationClient);

async function migrateDB() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  console.log("Migrations complete.");
  await migrationClient.end();
}

migrateDB().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
