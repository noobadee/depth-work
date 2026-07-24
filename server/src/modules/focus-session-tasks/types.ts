import type {
  FocusSessionTask,
  NewFocusSessionTask,
} from "@/db/schema/index.ts";

export interface IFocusSessionTaskRepository {
  findAllBySession(focusId: string): Promise<FocusSessionTask[] | null>;
  findBySessionTask(
    focusId: string,
    taskId: string,
  ): Promise<FocusSessionTask | null>;
  create(data: NewFocusSessionTask): Promise<FocusSessionTask | null>;
  update(
    focusId: string,
    taskId: string,
    data: Partial<Pick<FocusSessionTask, "position" | "completed_in_session">>,
  ): Promise<FocusSessionTask | null>;
  delete(focusId: string, taskId: string): Promise<void>;
}

export interface IFocusSessionTaskService {
  getFocusSessionTasks(focusId: string): Promise<FocusSessionTask[]>;
  createFocusSessionTask(
    focusId: string,
    body: CreateFocusSessionTask,
  ): Promise<FocusSessionTask>;
  updateFocusSessionTask(
    focusId: string,
    taskId: string,
    body: UpdateFocusSessionTask,
  ): Promise<FocusSessionTask>;
  deleteFocusSessionTask(focusId: string, taskId: string): Promise<void>;
}

export interface CreateFocusSessionTask {
  taskId: string;
  position?: number;
}

export interface UpdateFocusSessionTask {
  position?: number;
  completedInSession?: boolean;
}
