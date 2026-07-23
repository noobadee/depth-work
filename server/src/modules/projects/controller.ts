import { requireUser } from "@/middleware/auth.middleware.ts";
import { sendSuccess } from "@/utils/response.ts";
import type { Request, Response } from "express";
import type { IProjectService } from "@/modules/projects/types.ts";
import type {
  CreateProjectBody,
  ProjectIdParam,
  UpdateProjectBody,
} from "@/modules/projects/schemas.ts";
import type { WorkspaceIdParam } from "@/modules/workspaces/schemas.ts";

export class ProjectController {
  constructor(private readonly service: IProjectService) {}

  getAll = async (req: Request, res: Response) => {
    const { workspace_id } = req.params as WorkspaceIdParam;
    const projects = await this.service.getProjects(workspace_id);
    sendSuccess({
      res,
      data: projects,
      message: "Successfully fetched all projects",
    });
  };

  getOne = async (req: Request, res: Response) => {
    const { project_id } = req.params as ProjectIdParam;
    const project = await this.service.getProject(project_id);
    sendSuccess({
      res,
      data: project,
      message: "Successfully fetch a project",
    });
  };

  create = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { workspace_id } = req.params as WorkspaceIdParam;
    const body = req.body as CreateProjectBody;
    const newProject = await this.service.createProject(
      user.id,
      workspace_id,
      body,
    );
    sendSuccess({
      res,
      data: newProject,
      message: "Successfully created a new project",
      httpStatus: 201,
    });
  };

  update = async (req: Request, res: Response) => {
    const { project_id } = req.params as ProjectIdParam;
    const body = req.body as UpdateProjectBody;
    const updatedProject = await this.service.updateProject(project_id, body);
    sendSuccess({
      res,
      data: updatedProject,
      message: "Successfully updated a project",
      httpStatus: 201,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { project_id } = req.params as ProjectIdParam;
    await this.service.deleteProject(project_id);
    sendSuccess({
      res,
      data: null,
      message: "Successfully deleted a project",
      httpStatus: 201,
    });
  };
}
