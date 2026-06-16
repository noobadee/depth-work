import {
  pgTable,
  pgEnum,
  text,
  uuid,
  timestamp,
  date,
  check,
} from "drizzle-orm/pg-core";
import { users } from "./auth/users.ts";
import { workspaces } from "./workspaces.ts";
import { sql } from "drizzle-orm";

export const projectStatusEnum = pgEnum("project_status", [
  "pending",
  "in_progress",
  "completed",
  "archived",
]);

export const projects = pgTable(
  "projects",
  {
    project_id: uuid("project_id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.workspace_id, { onDelete: "cascade" }),
    createdBy: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    description: text("description"),
    status: projectStatusEnum("status").notNull().default("pending"),
    start_date: date("start_date", { mode: "date" }),
    due_date: date("due_date", { mode: "date" }),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "chk_project_title_length",
      sql`length(${table.title}) BETWEEN 1 AND 255`,
    ),
    check(
      "chk_project_dates",
      sql`${table.start_date} IS NULL OR ${table.due_date} IS NULL OR ${table.due_date} >= ${table.start_date}`,
    ),
  ],
);
