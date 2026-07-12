export { makeFocusSessions, makeFocusSessionTasks };

import { randomUUID } from "node:crypto";
import type {
  NewFocusSession,
  NewFocusSessionTask,
} from "@/db/schema/index.ts";

interface MakeFocusSession {
  userId: string;
  status: "active" | "paused" | "completed";
  started_at: Date;
  ended_at: Date | null;
  duration_seconds: number | null;
}

interface MakeFocusSessionTask {
  focusId: string;
  taskId: string;
  position: number;
  completed_in_session: boolean;
  added_at: Date;
}

function makeFocusSessions(
  focusSessions: MakeFocusSession[],
): NewFocusSession[] {
  const newFocusSessions = focusSessions.map((focusSession) => ({
    focus_id: randomUUID(),
    userId: focusSession.userId,
    status: focusSession.status,
    started_at: focusSession.started_at,
    ended_at: focusSession.ended_at,
    duration_seconds: focusSession.duration_seconds,
  }));

  return newFocusSessions;
}

function makeFocusSessionTasks(
  focusSessionTasks: MakeFocusSessionTask[],
): NewFocusSessionTask[] {
  const newFocusSessionTasks = focusSessionTasks.map((focusSessionTask) => ({
    focus_task_id: randomUUID(),
    focusId: focusSessionTask.focusId,
    taskId: focusSessionTask.taskId,
    position: focusSessionTask.position,
    completed_in_session: focusSessionTask.completed_in_session,
    added_at: focusSessionTask.added_at,
  }));

  return newFocusSessionTasks;
}
