import { eq } from "drizzle-orm";
import { db } from "@/db/index.ts";
import { focus_sessions } from "@/db/schema/index.ts";
import type { IFocusSessionRepository } from "@/modules/focus-sessions/types.ts";
import type { FocusSession, NewFocusSession } from "@/db/schema/index.ts";

export class FocusSessionRepository implements IFocusSessionRepository {
  async findAllByOwner(userId: string): Promise<FocusSession[] | null> {
    const result = await db
      .select()
      .from(focus_sessions)
      .where(eq(focus_sessions.userId, userId))
      .orderBy(focus_sessions.created_at);
    return result ?? null;
  }

  async findById(id: string): Promise<FocusSession | null> {
    const [result] = await db
      .select()
      .from(focus_sessions)
      .where(eq(focus_sessions.focus_id, id))
      .limit(1);
    return result ?? null;
  }

  async findByTitle(title: string): Promise<FocusSession | null> {
    const [result] = await db
      .select()
      .from(focus_sessions)
      .where(eq(focus_sessions.title, title))
      .limit(1);
    return result ?? null;
  }

  async create(data: NewFocusSession): Promise<FocusSession | null> {
    const [result] = await db.insert(focus_sessions).values(data).returning();
    return result ?? null;
  }

  async update(
    id: string,
    data: Partial<
      Pick<FocusSession, "title" | "status" | "ended_at" | "duration_seconds">
    >,
  ): Promise<FocusSession | null> {
    const [result] = await db
      .update(focus_sessions)
      .set(data)
      .where(eq(focus_sessions.focus_id, id))
      .returning();
    return result ?? null;
  }

  async delete(id: string): Promise<void> {
    await db.delete(focus_sessions).where(eq(focus_sessions.focus_id, id));
  }
}
