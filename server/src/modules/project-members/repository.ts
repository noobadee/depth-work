import { and, eq } from "drizzle-orm";
import { db } from "@/db/index.ts";
import { projectMembers } from "@/db/schema/index.ts";
import type { NewProjectMember, ProjectMember } from "@/db/schema/index.ts";
import type { IProjectMemberRepository } from "@/modules/project-members/types.ts";

export class ProjectMemberRepository implements IProjectMemberRepository {
  async findAllByProject(projectId: string): Promise<ProjectMember[] | null> {
    const result = await db
      .select()
      .from(projectMembers)
      .where(eq(projectMembers.projectId, projectId));
    return result ?? null;
  }

  async findByProjectMember(
    userId: string,
    projectId: string,
  ): Promise<ProjectMember | null> {
    const [result] = await db
      .select()
      .from(projectMembers)
      .where(
        and(
          eq(projectMembers.userId, userId),
          eq(projectMembers.projectId, projectId),
        ),
      )
      .limit(1);
    return result ?? null;
  }

  async create(data: NewProjectMember): Promise<ProjectMember | null> {
    const [result] = await db.insert(projectMembers).values(data).returning();
    return result ?? null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(projectMembers).where(eq(projectMembers.id, id));
  }
}
