import {
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "@/common/errors/index.ts";
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

    if (!focusSessionTasks || focusSessionTasks.length === 0) {
      throw new NotFoundError("Focus session task");
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

    const updatedFocusSessionTask = await this.repo.update(
      focusId,
      taskId,
      body,
    );

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
