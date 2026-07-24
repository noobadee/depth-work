import { and, eq } from "drizzle-orm";
import { db } from "@/db/index.ts";
import { focus_session_tasks } from "@/db/schema/index.ts";
import type { IFocusSessionTaskRepository } from "@/modules/focus-session-tasks/types.ts";
import type {
  FocusSessionTask,
  NewFocusSessionTask,
} from "@/db/schema/index.ts";

export class FocusSessionTaskRepository implements IFocusSessionTaskRepository {
  async findAllBySession(focusId: string): Promise<FocusSessionTask[] | null> {
    const result = await db
      .select()
      .from(focus_session_tasks)
      .where(eq(focus_session_tasks.focusId, focusId))
      .orderBy(focus_session_tasks.added_at);
    return result ?? null;
  }

  async findBySessionTask(
    focusId: string,
    taskId: string,
  ): Promise<FocusSessionTask | null> {
    const [result] = await db
      .select()
      .from(focus_session_tasks)
      .where(
        and(
          eq(focus_session_tasks.focusId, focusId),
          eq(focus_session_tasks.taskId, taskId),
        ),
      )
      .limit(1);
    return result ?? null;
  }

  async create(data: NewFocusSessionTask): Promise<FocusSessionTask | null> {
    const [result] = await db
      .insert(focus_session_tasks)
      .values(data)
      .returning();
    return result ?? null;
  }

  async update(
    focusId: string,
    taskId: string,
    data: Partial<Pick<FocusSessionTask, "position" | "completed_in_session">>,
  ): Promise<FocusSessionTask | null> {
    const [result] = await db
      .update(focus_session_tasks)
      .set(data)
      .where(
        and(
          eq(focus_session_tasks.focusId, focusId),
          eq(focus_session_tasks.taskId, taskId),
        ),
      )
      .returning();
    return result ?? null;
  }

  async delete(focusId: string, taskId: string): Promise<void> {
    await db
      .delete(focus_session_tasks)
      .where(
        and(
          eq(focus_session_tasks.focusId, focusId),
          eq(focus_session_tasks.taskId, taskId),
        ),
      );
  }
}
