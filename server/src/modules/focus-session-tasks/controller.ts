import { requireUser } from "@/middleware/auth.middleware.ts";
import { sendSuccess } from "@/utils/response.ts";
import type { Request, Response } from "express";
import type { IFocusSessionTaskService } from "@/modules/focus-session-tasks/types.ts";
import type {
  CreateFocusSessionTaskBody,
  UpdateFocusSessionTaskBody,
  FocusSessionTaskParams,
} from "@/modules/focus-session-tasks/schemas.ts";
import type { FocusSessionIdParam } from "@/modules/focus-sessions/schemas.ts";

export class FocusSessionTaskController {
  constructor(private readonly service: IFocusSessionTaskService) {}

  getAll = async (req: Request, res: Response) => {
    const { focus_id } = req.params as FocusSessionIdParam;
    const focusSessionTasks = await this.service.getFocusSessionTasks(focus_id);
    sendSuccess({
      res,
      data: focusSessionTasks,
      message: "Successfully fetched all focus session tasks",
    });
  };

  create = async (req: Request, res: Response) => {
    const { focus_id } = req.params as FocusSessionIdParam;
    const body = req.body as CreateFocusSessionTaskBody;
    const newFocusSessionTask = await this.service.createFocusSessionTask(
      focus_id,
      body,
    );
    sendSuccess({
      res,
      data: newFocusSessionTask,
      message: "Successfully created a new focus session task",
      httpStatus: 201,
    });
  };

  update = async (req: Request, res: Response) => {
    const { focus_id, task_id } = req.params as FocusSessionTaskParams;
    const body = req.body as UpdateFocusSessionTaskBody;
    const updatedFocusSessionTask = await this.service.updateFocusSessionTask(
      focus_id,
      task_id,
      body,
    );
    sendSuccess({
      res,
      data: updatedFocusSessionTask,
      message: "Successfully updated a focus session task",
      httpStatus: 201,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { focus_id, task_id } = req.params as FocusSessionTaskParams;
    await this.service.deleteFocusSessionTask(focus_id, task_id);
    sendSuccess({
      res,
      data: null,
      message: "Successfully deleted a focus session task",
      httpStatus: 201,
    });
  };
}
