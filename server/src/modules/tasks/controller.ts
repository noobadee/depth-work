import { requireUser } from "@/middleware/auth.middleware.ts";
import { sendSuccess } from "@/utils/response.ts";
import type { Request, Response } from "express";
import type { ITaskService } from "@/modules/tasks/types.ts";
import type {
  CreateTaskBody,
  TaskIdParam,
  UpdateTaskBody,
} from "@/modules/tasks/schemas.ts";
import type { WorkspaceIdParam } from "@/modules/workspaces/schemas.ts";
import type { ProjectIdParam } from "@/modules/projects/schemas.ts";

export class TaskController {
  constructor(private readonly service: ITaskService) {}

  getAll = async (req: Request, res: Response) => {
    const { workspace_id } = req.params as WorkspaceIdParam;
    const tasks = await this.service.getTasks(workspace_id);
    sendSuccess({
      res,
      data: tasks,
      message: "Successfully fetched all tasks",
    });
  };

  getAllUnderProject = async (req: Request, res: Response) => {
    const { project_id } = req.params as ProjectIdParam;
    const tasks = await this.service.getTasksUnderProject(project_id);
    sendSuccess({
      res,
      data: tasks,
      message: "Successfully fetched all tasks under a project",
    });
  };

  getOne = async (req: Request, res: Response) => {
    const { task_id } = req.params as TaskIdParam;
    const task = await this.service.getTask(task_id);
    sendSuccess({ res, data: task, message: "Successfully fetched a task" });
  };

  createTask = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { workspace_id } = req.params as WorkspaceIdParam;
    const body = req.body as CreateTaskBody;
    const newTask = await this.service.createTask(user.id, workspace_id, body);
    sendSuccess({
      res,
      data: newTask,
      message: "Successfully created a new task",
      httpStatus: 201,
    });
  };

  createTaskUnderProject = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { workspace_id } = req.params as WorkspaceIdParam;
    const { project_id } = req.params as ProjectIdParam;
    const body = req.body as CreateTaskBody;
    const newTask = await this.service.createTaskUnderProject(
      user.id,
      workspace_id,
      project_id,
      body,
    );
    sendSuccess({
      res,
      data: newTask,
      message: "Successfully created a new task under a project",
      httpStatus: 201,
    });
  };

  update = async (req: Request, res: Response) => {
    const { task_id } = req.params as TaskIdParam;
    const body = req.body as UpdateTaskBody;
    const updatedTask = await this.service.updateTask(task_id, body);
    sendSuccess({
      res,
      data: updatedTask,
      message: "Successfully updated a task",
      httpStatus: 201,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { task_id } = req.params as TaskIdParam;
    await this.service.deleteTask(task_id);
    sendSuccess({
      res,
      data: null,
      message: "Successfully deleted a task",
      httpStatus: 201,
    });
  };
}
