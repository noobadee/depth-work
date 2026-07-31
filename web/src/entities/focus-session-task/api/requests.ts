export {
  fetchFocusSessionTasks,
  createFocusSessionTask,
  updateFocusSessionTask,
  deleteFocusSessionTask,
};

import {
  focusSessionTaskResponseSchema,
  type FocusSessionTask,
} from "@/entities/focus-session-task";
import { httpClient, parseOrThrow } from "@/shared/api";

async function fetchFocusSessionTasks(
  focusId: string,
): Promise<FocusSessionTask> {
  const raw = await httpClient.get<unknown>(`/focus-sessions/${focusId}/tasks`);
  return parseOrThrow(focusSessionTaskResponseSchema, raw);
}

export interface CreateFocusSessionTask {
  focusId: string;
  taskId: string;
  position?: number;
}

async function createFocusSessionTask({
  focusId,
  ...input
}: CreateFocusSessionTask): Promise<FocusSessionTask> {
  const raw = await httpClient.post<unknown>(
    `/focus-sessions/${focusId}/tasks`,
    input,
  );
  return parseOrThrow(focusSessionTaskResponseSchema, raw);
}

export interface UpdateFocusSessionTask {
  focusId: string;
  taskId: string;
  position: number;
  completedInSession?: boolean;
}

async function updateFocusSessionTask({
  focusId,
  taskId,
  ...input
}: UpdateFocusSessionTask): Promise<FocusSessionTask> {
  const raw = await httpClient.patch<unknown>(
    `/focus-sessions/${focusId}/tasks/${taskId}`,
    input,
  );
  return parseOrThrow(focusSessionTaskResponseSchema, raw);
}

async function deleteFocusSessionTask({
  focusId,
  taskId,
}: {
  focusId: string;
  taskId: string;
}): Promise<void> {
  await httpClient.delete<unknown>(
    `/focus-sessions/${focusId}/tasks/${taskId}`,
  );
}
