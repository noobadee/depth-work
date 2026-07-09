import {
  pgTable,
  pgEnum,
  text,
  uuid,
  unique,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth.ts";

export const workspaceTypeEnum = pgEnum("workspace_type", ["personal", "team"]);

export const workspaces = pgTable(
  "workspaces",
  {
    workspace_id: uuid("workspace_id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    type: workspaceTypeEnum("type").notNull().default("personal"),
    ownerId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "set null" }),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_workspace_name_per_owner").on(table.name, table.ownerId),
  ],
);

export type NewWorkspace = typeof workspaces.$inferInsert;
