import {
  pgTable,
  pgEnum,
  text,
  uuid,
  timestamp,
  unique,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth.ts";
import { workspaces } from "./workspaces.ts";

export const workspaceRoleEnum = pgEnum("workspace_role", [
  "owner",
  "admin",
  "member",
  "viewer",
]);

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.workspace_id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: workspaceRoleEnum("role").notNull().default("member"),
    joined_at: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_workspace_member").on(table.workspaceId, table.userId),
    uniqueIndex("uq_one_owner_per_workspace")
      .on(table.workspaceId)
      .where(sql`${table.role} = 'owner'`),
  ],
);

export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;
