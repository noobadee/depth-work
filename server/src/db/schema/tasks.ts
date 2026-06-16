import {
  pgTable,
  pgEnum,
  integer,
  text,
  uuid,
  date,
  timestamp,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./auth/users.ts";
import { workspaces } from "./workspaces.ts";
import { projects } from "./projects.ts";

export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
]);
export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "in_progress",
  "completed",
]);

export const tasks = pgTable(
  "tasks",
  {
    task_id: uuid("task_id").primaryKey().defaultRandom(),
    workspace_id: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.workspace_id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.project_id, {
      onDelete: "set null",
    }),
    createdBy: text("created_by").references(() => users.id, {
      onDelete: "set null",
    }),
    assignedTo: text("assigned_to").references(() => users.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    priority: taskPriorityEnum("priority").notNull().default("medium"),
    status: taskStatusEnum("status").notNull().default("pending"),
    due_date: date("due_date", { mode: "date" }),
    completed_at: timestamp("completed_at", { withTimezone: true }),
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
      "chk_task_title_length",
      sql`length(${table.title}) BETWEEN 1 AND 255`,
    ),
    check(
      "chk_task_completed_at",
      sql`(${table.status} = 'completed' AND ${table.completed_at} IS NOT NULL)
      OR (${table.status} != 'completed' AND ${table.completed_at} IS NULL)`,
    ),
  ],
);
