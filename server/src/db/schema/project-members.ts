import { pgTable, uuid, text, timestamp, unique } from "drizzle-orm/pg-core";
import { projects } from "./projects.ts";
import { user } from "./auth.ts";

export const projectMembers = pgTable(
  "project_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.project_id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    added_at: timestamp("added_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [unique("uq_project_member").on(table.projectId, table.userId)],
);

export type NewProjectMember = typeof projectMembers.$inferInsert;
export type ProjectMember = typeof projectMembers.$inferSelect;
