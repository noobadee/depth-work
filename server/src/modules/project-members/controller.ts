import { sendSuccess } from "@/utils/response.ts";
import type { Request, Response } from "express";
import type { IProjectMemberService } from "@/modules/project-members/types.ts";
import type { CreateProjectMemberBody } from "@/modules/project-members/schemas.ts";
import type { ProjectMemberParams } from "@/modules/project-members/schemas.ts";
import type { ProjectIdParam } from "@/modules/projects/schemas.ts";

export class ProjectMemberController {
  constructor(private readonly service: IProjectMemberService) {}

  getAll = async (req: Request, res: Response) => {
    const { project_id } = req.params as ProjectIdParam;
    const projectMembers = await this.service.getProjectMembers(project_id);
    sendSuccess({
      res,
      data: projectMembers,
      message: "Successfully fetched all project members",
    });
  };

  create = async (req: Request, res: Response) => {
    const { project_id } = req.params as ProjectIdParam;
    const body = req.body as CreateProjectMemberBody;
    const newProjectMember = await this.service.createProjectMember(
      project_id,
      body,
    );
    sendSuccess({
      res,
      data: newProjectMember,
      message: "Successfully created a new project member",
      httpStatus: 201,
    });
  };

  delete = async (req: Request, res: Response) => {
    const { user_id, project_id } = req.params as ProjectMemberParams;
    await this.service.deleteProjectMember(user_id, project_id);
    sendSuccess({
      res,
      data: null,
      message: "Successfully deleted a project member",
      httpStatus: 201,
    });
  };
}
