import { eq } from "drizzle-orm";
import { db } from "@/db/index.ts";
import { workspaces } from "@/db/schema/index.ts";
import type { NewWorkspace, Workspace } from "@/db/schema/index.ts";
import type { IWorkspaceRepository } from "./types.ts";

export class WorkspaceRepository implements IWorkspaceRepository {
  async findAllByOwner(ownerId: string): Promise<Workspace[]> {
    return db
      .select()
      .from(workspaces)
      .where(eq(workspaces.ownerId, ownerId))
      .orderBy(workspaces.created_at);
  }

  async findById(id: string): Promise<Workspace | null> {
    const result = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.workspace_id, id))
      .limit(1);
    return result[0] ?? null;
  }

  async create(data: NewWorkspace): Promise<Workspace | null> {
    const [workspace] = await db.insert(workspaces).values(data).returning();
    return workspace ?? null;
  }

  async update(
    id: string,
    data: Partial<Pick<Workspace, "name">>,
  ): Promise<Workspace | null> {
    const [workspace] = await db
      .update(workspaces)
      .set({ ...data, updated_at: new Date() })
      .where(eq(workspaces.workspace_id, id))
      .returning();
    return workspace ?? null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(workspaces).where(eq(workspaces.workspace_id, id));
  }
}
