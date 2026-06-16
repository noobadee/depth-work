import {
  pgTable,
  pgEnum,
  text,
  uuid,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./auth/users.ts";
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
      .references(() => users.id, { onDelete: "cascade" }),
    role: workspaceRoleEnum("role").notNull().default("member"),
    joined_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique("uq_workspace_member").on(table.workspaceId, table.userId),
  ],
);
