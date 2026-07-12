export default resetDB;

import {
  user,
  session,
  account,
  verification,
  workspaces,
  workspaceMembers,
  projects,
  tasks,
  focus_sessions,
  focus_session_tasks,
} from "@/db/schema/index.ts";
import type { DB } from "@/db/index.ts";

async function resetDB(db: DB) {
  await db.transaction(async (tx) => {
    console.log("🧹 Clearing existing data...");

    await tx.delete(focus_session_tasks);
    await tx.delete(focus_sessions);
    await tx.delete(tasks);
    await tx.delete(projects);
    await tx.delete(workspaceMembers);
    await tx.delete(workspaces);
    await tx.delete(verification);
    await tx.delete(session);
    await tx.delete(account);
    await tx.delete(user);

    console.log("✅ All tables are cleared!");
  });
}
