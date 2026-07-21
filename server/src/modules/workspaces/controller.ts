import { requireUser } from "@/middleware/auth.middleware.ts";
import { sendSuccess } from "@/utils/response.ts";
import type { Request, Response } from "express";
import type { IWorkspaceService } from "@/modules/workspaces/types.ts";
import type {
  CreateWorkspaceBody,
  UpdateWorkspaceBody,
  WorkspaceIdParams,
} from "@/modules/workspaces/schemas.ts";

export class WorkspaceController {
  constructor(private readonly service: IWorkspaceService) {}

  getAll = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const workspaceList = await this.service.getWorkspaces(user.id);
    sendSuccess({
      res,
      data: workspaceList,
      message: "Successfully fetched all workspaces",
    });
  };

  getOne = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { workspace_id } = req.params as WorkspaceIdParams;
    const workspace = await this.service.getWorkspace(workspace_id, user.id);
    sendSuccess({
      res,
      data: workspace,
      message: `Successfully fetched a workspace with ID: ${workspace_id}`,
    });
  };

  create = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const body = req.body as CreateWorkspaceBody;
    const newWorkspace = await this.service.createWorkspace(user.id, body);
    sendSuccess({
      res,
      data: newWorkspace,
      message: "Successfully created a new workspace",
      httpStatus: 201,
    });
  };

  update = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const body = req.body as UpdateWorkspaceBody;
    const { workspace_id } = req.params as WorkspaceIdParams;
    const updatedWorkspace = await this.service.updateWorkspace(
      workspace_id,
      user.id,
      body,
    );
    sendSuccess({
      res,
      data: updatedWorkspace,
      message: "Successfully updated a workspace",
      httpStatus: 201,
    });
  };

  delete = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { workspace_id } = req.params as WorkspaceIdParams;
    await this.service.deleteWorkspace(workspace_id, user.id);
    sendSuccess({
      res,
      data: null,
      message: "Successfully deleted a workspace",
      httpStatus: 201,
    });
  };
}
