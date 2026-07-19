import { eq } from "drizzle-orm";
import { db } from "@/db/index.ts";
import { workspaceMembers } from "@/db/schema/index.ts";
import type { NewWorkspaceMember, WorkspaceMember } from "@/db/schema/index.ts";
import type { IWorkspaceMemberRepository } from "@/modules/workspace-members/types.ts";

export class WorkspaceMemberRepository implements IWorkspaceMemberRepository {
  async findAllByWorkspaceId(
    workspaceId: string,
  ): Promise<WorkspaceMember[] | null> {
    const result = await db
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.workspaceId, workspaceId))
      .orderBy(workspaceMembers.joined_at);
    return result ?? null;
  }

  async findById(id: string): Promise<WorkspaceMember | null> {
    const [result] = await db
      .select()
      .from(workspaceMembers)
      .where(eq(workspaceMembers.id, id))
      .limit(1);
    return result ?? null;
  }

  async create(data: NewWorkspaceMember): Promise<WorkspaceMember | null> {
    const [result] = await db.insert(workspaceMembers).values(data).returning();
    return result ?? null;
  }

  async update(
    id: string,
    data: Pick<WorkspaceMember, "role">,
  ): Promise<WorkspaceMember | null> {
    const [result] = await db
      .update(workspaceMembers)
      .set({ ...data })
      .where(eq(workspaceMembers.id, id))
      .returning();
    return result ?? null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(workspaceMembers).where(eq(workspaceMembers.id, id));
  }
}
