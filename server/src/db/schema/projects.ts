import {
  pgTable,
  pgEnum,
  text,
  varchar,
  uuid,
  timestamp,
  date,
  check,
  integer,
} from "drizzle-orm/pg-core";
import { user } from "./auth.ts";
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
      .references(() => user.id, { onDelete: "set null" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    status: projectStatusEnum("status").notNull().default("pending"),
    start_date: date("start_date", { mode: "date" }),
    due_date: date("due_date", { mode: "date" }),
    position: integer("position").notNull().default(0),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "chk_project_dates",
      sql`${table.start_date} IS NULL OR ${table.due_date} IS NULL OR ${table.due_date} >= ${table.start_date}`,
    ),
  ],
);

export type NewProject = typeof projects.$inferInsert;
export type Project = typeof projects.$inferSelect;
