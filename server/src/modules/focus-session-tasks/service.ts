import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "@/common/errors/index.ts";
import { FocusSessionRepository } from "@/modules/focus-sessions/repository.ts";
import type { FocusSessionTask } from "@/db/schema/index.ts";
import type {
  CreateFocusSessionTask,
  IFocusSessionTaskRepository,
  IFocusSessionTaskService,
  UpdateFocusSessionTask,
} from "@/modules/focus-session-tasks/types.ts";

export class FocusSessionTaskService implements IFocusSessionTaskService {
  constructor(private readonly repo: IFocusSessionTaskRepository) {}

  async getFocusSessionTasks(focusId: string): Promise<FocusSessionTask[]> {
    const focusSessionTasks = await this.repo.findAllBySession(focusId);

    if (!focusSessionTasks) {
      throw new DatabaseError("Unexpected database operation failed");
    }

    return focusSessionTasks;
  }

  async createFocusSessionTask(
    focusId: string,
    body: CreateFocusSessionTask,
  ): Promise<FocusSessionTask> {
    const existingFocusSessionTask = await this.repo.findBySessionTask(
      focusId,
      body.taskId,
    );

    if (existingFocusSessionTask) {
      throw new ConflictError("Focus session task already exists");
    }

    const focusSessionRepo = new FocusSessionRepository();
    const focusSession = await focusSessionRepo.findById(focusId);

    if (!focusSession) {
      throw new NotFoundError("Focus session");
    }

    const newFocusSessionTask = await this.repo.create({ ...body, focusId });

    if (!newFocusSessionTask) {
      throw new DatabaseError(
        "Insert succeeded but no row was returned for focus session task creation",
      );
    }

    return newFocusSessionTask;
  }

  async updateFocusSessionTask(
    focusId: string,
    taskId: string,
    body: UpdateFocusSessionTask,
  ): Promise<FocusSessionTask> {
    if (Object.keys(body).length === 0) {
      throw new ValidationError("The body cannot be empty");
    }

    const focusSessionRepo = new FocusSessionRepository();
    const focusSession = await focusSessionRepo.findById(focusId);

    if (!focusSession) {
      throw new NotFoundError("Focus session");
    }

    const updatedFocusSessionTask = await this.repo.update(focusId, taskId, {
      completed_in_session: body.completedInSession,
    });

    if (!updatedFocusSessionTask) {
      throw new DatabaseError(
        "Update succeeded but no row was returned for focus session task update",
      );
    }

    return updatedFocusSessionTask;
  }

  async deleteFocusSessionTask(focusId: string, taskId: string): Promise<void> {
    await this.repo.delete(focusId, taskId);
  }
}
