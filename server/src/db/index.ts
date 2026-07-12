import { drizzle } from "drizzle-orm/postgres-js";
import client from "./client.ts";
import * as schema from "./schema/index.ts";

export const db = drizzle(client, { schema });
export type DB = typeof db;
