import type { FocusSession, NewFocusSession } from "@/db/schema/index.ts";

export interface IFocusSessionRepository {
  findAllByOwner(userId: string): Promise<FocusSession[] | null>;
  findById(id: string): Promise<FocusSession | null>;
  findByTitle(title: string): Promise<FocusSession | null>;
  create(data: NewFocusSession): Promise<FocusSession | null>;
  update(
    id: string,
    data: Partial<
      Pick<FocusSession, "title" | "status" | "ended_at" | "duration_seconds">
    >,
  ): Promise<FocusSession | null>;
  delete(id: string): Promise<void>;
}

export interface IFocusSessionService {
  getFocusSessions(userId: string): Promise<FocusSession[]>;
  getFocusSession(id: string, userId: string): Promise<FocusSession>;
  createFocusSession(
    creatorId: string,
    body: CreateFocusSessionInput,
  ): Promise<FocusSession>;
  updateFocusSession(
    id: string,
    ownerId: string,
    body: UpdateFocusSessionInput,
  ): Promise<FocusSession>;
  updateCompleteFocusSession(
    id: string,
    ownerId: string,
    body: UpdateCompleteFocusSessionInput,
  ): Promise<FocusSession>;
  deleteFocusSession(id: string, ownerId: string): Promise<void>;
}

export interface CreateFocusSessionInput {
  title?: string | null;
  status?: "active" | "paused" | "completed";
  endedAt?: Date | null;
  durationSeconds?: number | null;
}

export interface UpdateFocusSessionInput {
  title?: string | null;
  status?: "active" | "paused" | "completed";
  endedAt?: Date | null;
  durationSeconds?: number | null;
}

export interface UpdateCompleteFocusSessionInput {
  title?: string | null;
  status: "active" | "paused" | "completed";
  startedAt: Date;
  endedAt?: Date | null;
  durationSeconds: number;
}
