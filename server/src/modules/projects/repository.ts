import { eq } from "drizzle-orm";
import { db } from "@/db/index.ts";
import { projects } from "@/db/schema/index.ts";
import type { NewProject, Project } from "@/db/schema/index.ts";
import type { IProjectRepository } from "@/modules/projects/types.ts";

export class ProjectRepository implements IProjectRepository {
  async findAllByWorkspace(workspaceId: string): Promise<Project[] | null> {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.workspaceId, workspaceId))
      .orderBy(projects.created_at);
    return result ?? null;
  }

  async findById(id: string): Promise<Project | null> {
    const [result] = await db
      .select()
      .from(projects)
      .where(eq(projects.project_id, id))
      .limit(1);
    return result ?? null;
  }

  async findByTitle(title: string): Promise<Project | null> {
    const [result] = await db
      .select()
      .from(projects)
      .where(eq(projects.title, title))
      .limit(1);
    return result ?? null;
  }

  async create(data: NewProject): Promise<Project | null> {
    const [result] = await db.insert(projects).values(data).returning();
    return result ?? null;
  }

  async update(
    id: string,
    data: Partial<
      Pick<
        Project,
        | "title"
        | "description"
        | "status"
        | "start_date"
        | "due_date"
        | "position"
      >
    >,
  ): Promise<Project | null> {
    const [result] = await db
      .update(projects)
      .set(data)
      .where(eq(projects.project_id, id))
      .returning();
    return result ?? null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.project_id, id));
  }
}
