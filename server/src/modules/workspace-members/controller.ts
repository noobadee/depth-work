import { requireUser } from "@/middleware/auth.middleware.ts";
import { sendSuccess } from "@/utils/response.ts";
import type { Request, Response } from "express";
import type { IWorkspaceMemberService } from "@/modules/workspace-members/types.ts";
import type {
  CreateWorkspaceMemberBody,
  UpdateWorkspaceMemberBody,
  WorkspaceIdBody,
  WorkspaceMemberIdParams,
} from "@/modules/workspace-members/schemas.ts";

export class WorkspaceMemberController {
  constructor(private readonly service: IWorkspaceMemberService) {}

  getAll = async (req: Request, res: Response) => {
    const { workspaceId } = req.body as WorkspaceIdBody;
    const workspaceMembers =
      await this.service.getWorkspaceMembers(workspaceId);
    sendSuccess({
      res,
      data: workspaceMembers,
      message: "Successfully fetched all workspace members",
    });
  };

  getOne = async (req: Request, res: Response) => {
    const { id: workspaceMemberId } = req.params as WorkspaceMemberIdParams;
    const { workspaceId } = req.body as WorkspaceIdBody;
    const workspaceMember = await this.service.getWorkspaceMember(
      workspaceMemberId,
      workspaceId,
    );
    sendSuccess({
      res,
      data: workspaceMember,
      message: `Successfully fetched a workspace member with ID: ${workspaceMemberId}`,
    });
  };

  create = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const body = req.body as CreateWorkspaceMemberBody;
    const newWorkspaceMember = await this.service.createWorkspaceMember(
      user.id,
      body,
    );
    sendSuccess({
      res,
      data: newWorkspaceMember,
      message: "Successfully created a new workspace member",
      httpStatus: 201,
    });
  };

  update = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { id: workspaceMemberId } = req.params as WorkspaceMemberIdParams;
    const body = req.body as UpdateWorkspaceMemberBody;
    const updatedWorkspaceMember = await this.service.updateWorkspaceMember(
      { id: workspaceMemberId },
      user.id,
      body,
    );
    sendSuccess({
      res,
      data: updatedWorkspaceMember,
      message: "Successfully updated a workspace member",
      httpStatus: 201,
    });
  };

  delete = async (req: Request, res: Response) => {
    const user = requireUser(req);
    const { workspaceId } = req.body as WorkspaceIdBody;
    const { id: workspaceMemberId } = req.params as WorkspaceMemberIdParams;
    await this.service.deleteWorkspaceMember(
      { id: workspaceMemberId },
      { workspaceId },
      user.id,
    );
    sendSuccess({
      res,
      data: null,
      message: "Successfully deleted a workspace member",
      httpStatus: 201,
    });
  };
}
