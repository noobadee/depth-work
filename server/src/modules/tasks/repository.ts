import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db/index.ts";
import { tasks } from "@/db/schema/index.ts";
import type { ITaskRepository } from "@/modules/tasks/types.ts";
import type { NewTask, Task } from "@/db/schema/index.ts";

export class TaskRepository implements ITaskRepository {
  async findAllByWorkspace(workspaceId: string): Promise<Task[] | null> {
    const result = await db
      .select()
      .from(tasks)
      .where(eq(tasks.workspace_id, workspaceId))
      .orderBy(tasks.created_at);
    return result ?? null;
  }

  async findAllByProject(projectId: string): Promise<Task[] | null> {
    const result = await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(tasks.created_at);
    return result ?? null;
  }

  async findById(id: string): Promise<Task | null> {
    const [result] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.task_id, id))
      .limit(1);
    return result ?? null;
  }

  async findByTitle(title: string): Promise<Task | null> {
    const [result] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.title, title), isNull(tasks.projectId)))
      .limit(1);
    return result ?? null;
  }

  async findByTitleUnderProject(
    title: string,
    projectId: string,
  ): Promise<Task | null> {
    const [result] = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.title, title), eq(tasks.projectId, projectId)))
      .limit(1);
    return result ?? null;
  }

  async createTaskUnderWorkspace(
    workspaceId: string,
    data: NewTask,
  ): Promise<Task | null> {
    const [result] = await db
      .insert(tasks)
      .values({ ...data, workspace_id: workspaceId })
      .returning();
    return result ?? null;
  }

  async createTaskUnderProject(
    workspaceId: string,
    projectId: string,
    data: NewTask,
  ): Promise<Task | null> {
    const [result] = await db
      .insert(tasks)
      .values({ ...data, workspace_id: workspaceId, projectId })
      .returning();
    return result ?? null;
  }

  async update(
    id: string,
    data: Partial<
      Pick<
        Task,
        | "assignedTo"
        | "title"
        | "description"
        | "priority"
        | "status"
        | "due_date"
        | "completed_at"
        | "position"
      >
    >,
  ): Promise<Task | null> {
    const [result] = await db
      .update(tasks)
      .set(data)
      .where(eq(tasks.task_id, id))
      .returning();
    return result ?? null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.task_id, id));
  }
}
