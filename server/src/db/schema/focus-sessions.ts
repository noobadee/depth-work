import {
  pgTable,
  pgEnum,
  text,
  uuid,
  timestamp,
  integer,
  check,
} from "drizzle-orm/pg-core";
import { users } from "./auth/users.ts";
import { sql } from "drizzle-orm";

export const focusStatusEnum = pgEnum("focus_status", [
  "active",
  "paused",
  "completed",
]);

export const focus_sessions = pgTable(
  "focus_sessions",
  {
    focus_id: uuid("focus_id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title")
      .notNull()
      .default(sql`to_char(now(), 'Mon DD, YYYY HH12:MI AM')`),
    status: focusStatusEnum("status").notNull().default("active"),
    started_at: timestamp("started_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    ended_at: timestamp("ended_at", { withTimezone: true }),
    duration_seconds: integer("duration_seconds"),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "chk_session_ended_at",
      sql`${table.ended_at} IS NULL OR ${table.ended_at} >= ${table.started_at}`,
    ),
    check(
      "chk_session_duration",
      sql`(${table.ended_at} IS NULL AND ${table.duration_seconds} IS NULL)
      OR (${table.ended_at} IS NOT NULL AND ${table.duration_seconds} IS NOT NULL AND ${table.duration_seconds} >= 0)`,
    ),
    check(
      "chk_session_status_consistency",
      sql`(${table.status} = 'completed' AND ${table.ended_at} IS NOT NULL AND ${table.duration_seconds} IS NOT NULL)
      OR (${table.status} != 'completed' AND ${table.ended_at} IS NULL AND ${table.duration_seconds} IS NULL)
      OR (${table.status} = 'paused' AND ${table.ended_at} IS NULL)`,
    ),
  ],
);
