import {
  pgTable,
  integer,
  uuid,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { tasks } from "./tasks.ts";
import { focus_sessions } from "./focus-sessions.ts";

export const focus_session_tasks = pgTable("focus_session_tasks", {
  focus_task_id: uuid("focus_task_id").primaryKey().defaultRandom(),
  focusId: uuid("focus_id")
    .notNull()
    .references(() => focus_sessions.focus_id, { onDelete: "cascade" }),
  taskId: uuid("task_id")
    .notNull()
    .references(() => tasks.task_id, { onDelete: "cascade" }),
  position: integer("position").notNull().default(0),
  completed_in_session: boolean("completed_session").notNull().default(false),
  added_at: timestamp("added_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type NewFocusSessionTask = typeof focus_session_tasks.$inferInsert;
export type FocusSessionTask = typeof focus_session_tasks.$inferSelect;
