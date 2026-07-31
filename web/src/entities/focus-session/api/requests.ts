export {
  fetchFocusSessions,
  fetchFocusSession,
  createFocusSession,
  updateFocusSession,
  updateCompleteFocusSession,
  deleteFocusSession,
};

import {
  focusSessionResponseSchema,
  type FocusSession,
} from "@/entities/focus-session";
import { httpClient, parseOrThrow } from "@/shared/api";

async function fetchFocusSessions(): Promise<FocusSession> {
  const raw = await httpClient.get<unknown>(`/focus-sessions`);
  return parseOrThrow(focusSessionResponseSchema, raw);
}

async function fetchFocusSession(focusId: string): Promise<FocusSession> {
  const raw = await httpClient.get<unknown>(`/focus-sessions/${focusId}`);
  return parseOrThrow(focusSessionResponseSchema, raw);
}

export interface CreateFocusSession {
  title?: string | null;
  status?: "active" | "paused" | "completed";
  endedAt?: Date | null;
  durationSeconds?: number | null;
}

async function createFocusSession(
  input: CreateFocusSession,
): Promise<FocusSession> {
  const raw = await httpClient.post<unknown>(`/focus-sessions`, input);
  return parseOrThrow(focusSessionResponseSchema, raw);
}

export interface UpdateFocusSession {
  focusId: string;
  title?: string | null;
  status?: "active" | "paused" | "completed";
  endedAt?: Date | null;
  durationSeconds?: number | null;
}

async function updateFocusSession({
  focusId,
  ...input
}: UpdateFocusSession): Promise<FocusSession> {
  const raw = await httpClient.patch<unknown>(
    `/focus-sessions/${focusId}`,
    input,
  );
  return parseOrThrow(focusSessionResponseSchema, raw);
}

export interface UpdateCompleteFocusSession {
  focusId: string;
  title?: string | null;
  status: "active" | "paused" | "completed";
  startedAt: Date;
  endedAt?: Date | null;
  durationSeconds: number;
}

async function updateCompleteFocusSession({
  focusId,
  ...input
}: UpdateCompleteFocusSession): Promise<FocusSession> {
  const raw = await httpClient.patch<unknown>(
    `/focus-sessions/${focusId}/complete`,
    input,
  );
  return parseOrThrow(focusSessionResponseSchema, raw);
}

async function deleteFocusSession(focusId: string): Promise<void> {
  await httpClient.delete<unknown>(`/focus-sessions/${focusId}`);
}
