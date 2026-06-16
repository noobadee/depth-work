import {
  pgTable,
  pgEnum,
  text,
  uuid,
  unique,
  timestamp,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./auth/users.ts";

export const workspaceTypeEnum = pgEnum("workspace_type", ["personal", "team"]);

export const workspaces = pgTable(
  "workspaces",
  {
    workspace_id: uuid("workspace_id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    type: workspaceTypeEnum("type").notNull().default("personal"),
    ownerId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "set null" }),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_workspace_name_per_owner").on(table.name, table.ownerId),
    check(
      "chk_workspace_name_length",
      sql`length(${table.name}) BETWEEN 1 AND 100`,
    ),
  ],
);
