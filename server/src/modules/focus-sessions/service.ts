import {
  ConflictError,
  DatabaseError,
  ForbiddenError,
  NotFoundError,
} from "@/common/errors/index.ts";
import type { FocusSession } from "@/db/schema/index.ts";
import type {
  CreateFocusSessionInput,
  IFocusSessionRepository,
  IFocusSessionService,
  UpdateFocusSessionInput,
  UpdateCompleteFocusSessionInput,
} from "@/modules/focus-sessions/types.ts";

export class FocusSessionService implements IFocusSessionService {
  constructor(private readonly repo: IFocusSessionRepository) {}

  async getFocusSessions(userId: string): Promise<FocusSession[]> {
    const focusSessions = await this.repo.findAllByOwner(userId);

    if (!focusSessions || focusSessions.length === 0) {
      throw new NotFoundError("Focus session");
    }

    return focusSessions;
  }

  async getFocusSession(id: string, userId: string): Promise<FocusSession> {
    const focusSession = await this.repo.findById(id);

    if (!focusSession) {
      throw new NotFoundError("Focus session");
    }

    if (focusSession.userId !== userId) {
      throw new ForbiddenError("You do not have access to this focus session");
    }

    return focusSession;
  }

  async createFocusSession(
    creatorId: string,
    body: CreateFocusSessionInput,
  ): Promise<FocusSession> {
    const duplicateTitle = body.title
      ? await this.repo.findByTitle(body.title)
      : null;

    if (duplicateTitle) {
      throw new ConflictError("Focus session title already exists");
    }

    const newFocusSession = await this.repo.create({
      ...body,
      userId: creatorId,
    });

    if (!newFocusSession) {
      throw new DatabaseError(
        "Insert succeeded but no row was returned for focus session creation",
      );
    }

    return newFocusSession;
  }

  async updateFocusSession(
    id: string,
    ownerId: string,
    body: UpdateFocusSessionInput,
  ): Promise<FocusSession> {
    await this.getFocusSession(id, ownerId); // verify existence and ownership

    const duplicateTitle = body.title
      ? await this.repo.findByTitle(body.title)
      : null;

    if (duplicateTitle) {
      throw new ConflictError("Focus session title already exists");
    }

    const updatedFocusSession = await this.repo.update(id, body);

    if (!updatedFocusSession) {
      throw new DatabaseError(
        "Update succeeded but no row was returned for focus session update",
      );
    }

    return updatedFocusSession;
  }

  async updateCompleteFocusSession(
    id: string,
    ownerId: string,
    body: UpdateCompleteFocusSessionInput,
  ): Promise<FocusSession> {
    await this.getFocusSession(id, ownerId); // verify existence and ownership

    const now = new Date();
    const wallClockSeconds = Math.floor(
      (now.getTime() - body.startedAt.getTime()) / 1000,
    );
    const finalDuration = Math.min(body.durationSeconds, wallClockSeconds);

    const completedFocusSession = await this.repo.update(id, {
      ...body,
      ended_at: now,
      duration_seconds: finalDuration,
    });

    if (!completedFocusSession) {
      throw new DatabaseError(
        "Update succeeded but no row was returned for focus session update",
      );
    }

    return completedFocusSession;
  }

  async deleteFocusSession(id: string, ownerId: string): Promise<void> {
    await this.getFocusSession(id, ownerId); // verify existence and ownership
    await this.repo.delete(id);
  }
}
